package watcher

import (
	"context"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"github.com/dustin/go-humanize/english"
	"github.com/fsnotify/fsnotify"
)

// DefaultSkipped is a list of paths that will be skipped by [Watcher].
var DefaultSkippedPaths = []string{"node_modules", "testdata", "vendor"}

const (
	logKeyPath            = "path"
	logKeyOp              = "op"
	logKeyErr             = "error"
	shutdownMsg           = "shutting down"
	defaultTickerInterval = 250 * time.Millisecond
)

// Option configures a [Watcher].
type Option func(*Watcher)

// Watcher watches a directory, and its sub directories, for changes to Go
// source files and publishes the events over a channel for other components
// to take action on them.
type Watcher struct {
	Events              chan *EventBatch
	ctx                 context.Context
	dirs                map[string]struct{}
	root                string
	fsn                 *fsnotify.Watcher
	skipPaths           []string
	batch               *EventBatch
	batchTicker         *time.Ticker
	batchTickerInterval time.Duration
	logger              *log.Logger
}

// New Watcher to monitor a directory and its sub directories for changes to
// Go source files.
//
// This function only constructs the Watcher. Call [Watcher.Watch] to start the
// actual monitoring.
func New(ctx context.Context, rootDir string, opts ...Option) *Watcher {
	w := &Watcher{
		Events:              make(chan *EventBatch),
		ctx:                 ctx,
		dirs:                make(map[string]struct{}),
		root:                rootDir,
		skipPaths:           DefaultSkippedPaths,
		batch:               newEventBatch(),
		batchTickerInterval: defaultTickerInterval,
		logger:              log.New(io.Discard),
	}

	for _, opt := range opts {
		opt(w)
	}

	return w
}

// Watch for changes to Go source files within the root directory and its
// sub directories.
//
// All paths prefixed with `.`, like `.git`, as well as paths defined in
// [DefaultSkippedPaths] are automatically skipped by the watcher. Additional
// paths can be added to the skip list with the [WithSkipPaths] option.
//
// If new directories are created within the root directory while Watcher is
// monitoring, they are automatically added to the watch list, unless they match
// a path to skip.
func (w *Watcher) Watch() error {
	var err error

	w.fsn, err = fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("creating fsnotify watcher: %w", err)
	}

	w.logger.Info("walking root directory for sub directories", "root", w.root)

	if err := filepath.Walk(w.root, w.walk); err != nil {
		return fmt.Errorf("walking root directory %q: %w", w.root, err)
	}

	w.batchTicker = time.NewTicker(w.batchTickerInterval)

	go w.watch()

	return nil
}

// Close Watcher.
func (w *Watcher) Close() error {
	close(w.Events)
	w.batchTicker.Stop()

	if err := w.fsn.Close(); err != nil {
		return fmt.Errorf("closing fsnotify watcher: %w", err)
	}

	return nil
}

func (w *Watcher) walk(path string, info fs.FileInfo, err error) error {
	if err != nil {
		return err
	}

	logger := w.logger.With(logKeyPath, path, "size", info.Size(), "dir", info.IsDir())

	if !info.IsDir() {
		return nil
	}

	basename := filepath.Base(path)

	if w.skippable(basename) {
		logger.Debug("skipping directory")
		return filepath.SkipDir
	}

	if _, ok := w.dirs[path]; ok {
		logger.Debug("ignoring known directory")
		return nil
	}

	if err := w.fsn.Add(path); err != nil {
		return fmt.Errorf("adding path %s to fsnotify watcher: %w", path, err)
	}

	w.logger.Debug("watching directory ", logKeyPath, path)

	return nil
}

func (w *Watcher) watch() { //nolint:revive // function is straight-forward despite high cognitive complexity.
	w.logger.Infof("watching %s for file changes...",
		english.Plural(len(w.fsn.WatchList()), "directory", "directories"),
	)

	for {
		select {
		case <-w.ctx.Done():
			w.logger.Info(shutdownMsg)

			if err := w.Close(); err != nil {
				w.logger.Error("error closing", logKeyErr, err)
			}

			return
		case _, ok := <-w.batchTicker.C:
			if !ok {
				w.logger.Info("shutting down")
				return
			}

			if len(w.batch.Events) == 0 {
				continue
			}

			batch := w.batch
			w.batch = newEventBatch()

			w.logger.Debug("publishing event batch", "events", len(batch.Events))
			w.Events <- batch
		case err, ok := <-w.fsn.Errors:
			if !ok {
				w.logger.Info(shutdownMsg)
				return
			}

			w.logger.Error("fsnotify error", logKeyErr, err)
		case e, ok := <-w.fsn.Events:
			if !ok {
				w.logger.Info(shutdownMsg)
				return
			}

			if err := w.handleEvent(e); err != nil {
				w.logger.Error("event error", logKeyErr, err, logKeyPath, e.Name, logKeyOp, e.Op)
			}
		}
	}
}

func (w *Watcher) handleEvent(e fsnotify.Event) error {
	if w.ignorable(e) {
		w.logger.Debug("ignoring event", logKeyPath, e.Name, logKeyOp, e.Op.String())
		return nil
	}

	w.logger.Debug("new event", logKeyPath, e.Name, logKeyOp, e.Op.String())

	switch {
	case e.Op.Has(fsnotify.Create):
		return w.handleCreateOp(e)
	case e.Op.Has(fsnotify.Write):
		return w.handleWriteOp(e)
	case e.Op.Has(fsnotify.Remove):
		return w.handleRemoveOp(e)
	default:
		w.logger.Debug("event unhandled", logKeyPath, e.Name, logKeyOp, e.Op.String())
	}

	return nil
}

func (w *Watcher) handleCreateOp(e fsnotify.Event) error {
	info, err := os.Stat(e.Name)
	if err != nil {
		if os.IsNotExist(err) {
			w.logger.Info("file or directory does not exist; ignoring event")
			return nil
		}

		return fmt.Errorf("getting information on file or directory %q: %w", e.Name, err)
	}

	if _, ok := w.dirs[e.Name]; !ok && info.IsDir() {
		if err := filepath.Walk(e.Name, w.walk); err != nil {
			return fmt.Errorf("walking new directory %q: %w", e.Name, err)
		}
	}

	if isGoFile(e.Name) {
		w.logger.Info("file created", logKeyPath, e.Name)
		w.batch.add(e.Name, Create)
	}

	return nil
}

func (w *Watcher) handleWriteOp(e fsnotify.Event) error {
	if isGoFile(e.Name) {
		w.logger.Info("file write", logKeyPath, e.Name)
		w.batch.add(e.Name, Write)
	}

	return nil
}

func (w *Watcher) handleRemoveOp(e fsnotify.Event) error {
	if _, ok := w.dirs[e.Name]; ok {
		delete(w.dirs, e.Name)

		w.logger.Info("removed deleted directory", logKeyPath, e.Name)

		return nil
	}

	if isGoFile(e.Name) {
		w.logger.Info("file deleted", logKeyPath, e.Name)
		w.batch.add(e.Name, Delete)
	}

	return nil
}

func (w *Watcher) ignorable(e fsnotify.Event) bool {
	if e.Op.Has(fsnotify.Chmod) {
		return true
	}

	return w.skippable(filepath.Base(e.Name))
}

func (w *Watcher) skippable(basename string) bool {
	if basename == "" || strings.HasPrefix(basename, ".") || strings.HasSuffix(basename, "~") {
		return true
	}

	for _, skip := range w.skipPaths {
		if basename == skip {
			return true
		}
	}

	return false
}

func isGoFile(path string) bool {
	return strings.HasSuffix(path, ".go")
}

// WithLogger configures [Watcher] to use given logger.
func WithLogger(logger *log.Logger) Option {
	return func(w *Watcher) {
		w.logger = logger
	}
}

// WithSkipPaths configures [Watcher] with additional paths to skip.
//
// Paths in [DefaultSkippedPaths] will always be skipped, as well as paths
// prefixed with `.` like `.git`.
func WithSkipPaths(paths ...string) Option {
	return func(w *Watcher) {
		w.skipPaths = append(w.skipPaths, paths...)
	}
}

// WithBatchInterval configures a [Watcher] to use interval for event batches.
//
// By default, watcher checks every 250ms if file events are ready to be
// published in a batch.
func WithBatchInterval(interval time.Duration) Option {
	return func(w *Watcher) {
		w.batchTickerInterval = interval
	}
}
