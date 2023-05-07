package coverparser

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"golang.org/x/tools/cover"

	"github.com/michenriksen/gokiburi/internal/pkg/command"
)

const defaultGoBin = "go"

var (
	// ErrNoProfiles is returned by [Parser.Parse] if profile contains no data.
	ErrNoProfiles = errors.New("cover profile contains no coverage data")

	// ErrNoPackages is returned by [Parser.Parse] if profile contains no package data.
	ErrNoPackages = errors.New("cover profile contains no package coverage data")
)

// Option configures a [Parser].
type Option func(*Parser)

// Parser parses Go test coverage profile data.
type Parser struct {
	ctx       context.Context
	root      string
	logger    *log.Logger
	goBin     string
	cmdRunner command.Runner
}

// New parser for Go test coverage profile data.
func New(ctx context.Context, rootDir string, opts ...Option) *Parser {
	p := &Parser{
		ctx:       ctx,
		root:      rootDir,
		logger:    log.New(io.Discard),
		goBin:     defaultGoBin,
		cmdRunner: command.DefaultRunner,
	}

	for _, opt := range opts {
		opt(p)
	}

	return p
}

// Parse test coverage data from Go coverprofile data.
//
// Parses the content of a file created by the `go test -coverprofile=...`
// command and returns a report with coverage data and contents of tested files.
//
// Uses [pkg.go.dev/golang.org/x/tools/cover] under the hood to parse the
// coverprofile data.
func (p *Parser) Parse(coverprofile io.Reader) (*Report, error) {
	profiles, err := cover.ParseProfilesFromReader(coverprofile)
	if err != nil {
		return nil, fmt.Errorf("parsing cover profile data: %w", err)
	}

	if len(profiles) == 0 {
		return nil, ErrNoProfiles
	}

	report := &Report{
		Mode: Mode(profiles[0].Mode),
		Time: time.Now(),
	}

	pkgs, err := p.profilePkgs(profiles)
	if err != nil {
		return nil, fmt.Errorf("getting packages from profiles: %w", err)
	}

	if len(pkgs) == 0 {
		return nil, ErrNoPackages
	}

	for _, cp := range profiles {
		profile := Profile{
			FileName: cp.FileName,
			Package:  path.Dir(cp.FileName),
		}

		profile.Path, err = p.pkgFile(pkgs, cp.FileName)
		if err != nil {
			return nil, fmt.Errorf("getting absolute path for %s: %w", cp.FileName, err)
		}

		profile.Content, err = os.ReadFile(profile.Path)
		if err != nil {
			return nil, fmt.Errorf("reading file %s: %w", profile.Path, err)
		}

		profile.Size = len(profile.Content)
		profile.Boundaries = p.profileBoundaries(profile.Content, cp)
		profile.Coverage = p.percentCovered(cp)
		profile.LineCount = p.lineCount(profile.Content)

		report.Profiles = append(report.Profiles, profile)
	}

	return report, nil
}

// profilePkgs returns a map of packages in cover profiles.
//
// Adapted from `findPkgs` function in go `src/cmd/cover/func.go:180` at
// commit `d922c0a`.
func (p *Parser) profilePkgs(profiles []*cover.Profile) (map[string]*pkg, error) {
	pkgs := make(map[string]*pkg)

	var list []string

	for _, profile := range profiles {
		if strings.HasPrefix(profile.FileName, ".") || filepath.IsAbs(profile.FileName) {
			// Relative or absolute path.
			continue
		}

		pkg := path.Dir(profile.FileName)

		if _, ok := pkgs[pkg]; !ok {
			pkgs[pkg] = nil

			list = append(list, pkg)
		}
	}

	if len(list) == 0 {
		return pkgs, nil
	}

	args := append([]string{"list", "-e", "-json"}, list...)

	out, exitCode, err := p.cmdRunner(p.ctx, p.root, p.goBin, args...)
	if err != nil {
		return nil, fmt.Errorf("running go list command: %w", err)
	}

	if exitCode != 0 {
		return nil, fmt.Errorf("non-zero exit code from go list command: %d", exitCode)
	}

	dec := json.NewDecoder(bytes.NewReader(out))

	for {
		var pkg pkg

		err := dec.Decode(&pkg)
		if err == io.EOF {
			break
		}

		if err != nil {
			return nil, fmt.Errorf("decoding go list json: %w", err)
		}

		pkgs[pkg.ImportPath] = &pkg
	}

	return pkgs, nil
}

// pkgFile returns absolute path to a file inside a package.
//
// Adapted from `findFile` function in go `src/cmd/cover/func.go:226` at
// commit `d922c0a`.
func (*Parser) pkgFile(pkgs map[string]*pkg, name string) (string, error) {
	if strings.HasPrefix(name, ".") || filepath.IsAbs(name) {
		// Relative or absolute path.
		return name, nil
	}

	pkg := pkgs[path.Dir(name)]

	if pkg != nil {
		if pkg.Dir != "" {
			return filepath.Join(pkg.Dir, path.Base(name)), nil
		}

		if pkg.Error != nil {
			return "", errors.New(pkg.Error.Err)
		}
	}

	return "", fmt.Errorf("no package for %s in go list output", name)
}

// profileBoundaries converts [cover.Boundary] structs in a profile to
// [ProfileBoundary] structs from this package.
//
// This is done to control how a report is marshalled to JSON.
func (*Parser) profileBoundaries(src []byte, profile *cover.Profile) []ProfileBoundary {
	cbs := profile.Boundaries(src)
	boundaries := make([]ProfileBoundary, len(cbs))

	for i, cb := range cbs {
		boundaries[i] = ProfileBoundary{
			Offset: cb.Offset,
			Start:  cb.Start,
			Count:  cb.Count,
			Norm:   cb.Norm,
			Index:  cb.Index,
		}
	}

	return boundaries
}

// percentCovered calculates the file coverage percentage from a profile.
func (*Parser) percentCovered(profile *cover.Profile) float64 {
	var total, covered int64

	for _, b := range profile.Blocks {
		total += int64(b.NumStmt)

		if b.Count > 0 {
			covered += int64(b.NumStmt)
		}
	}

	if total == 0 {
		return 0
	}

	percent := float64(covered) / float64(total) * 100
	ratio := math.Pow(10, float64(1))

	return math.Round(percent*ratio) / ratio
}

// lineCount returns the number of lines in a byte slice.
func (*Parser) lineCount(b []byte) int {
	return bytes.Count(b, []byte{'\n'}) + 1
}

// WithLogger configures [Parser] with a logger.
func WithLogger(logger *log.Logger) Option {
	return func(p *Parser) {
		p.logger = logger
	}
}

// WithGoBinPath configures [Parser] to use path as go binary for commands.
//
// By default, `go` is used.
func WithGoBinPath(goBinPath string) Option {
	return func(p *Parser) {
		p.goBin = goBinPath
	}
}
