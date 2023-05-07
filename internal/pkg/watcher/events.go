package watcher

// Op represents a file operation.
type Op int

// String representation of file operation.
func (o Op) String() string {
	return [...]string{
		"CREATE",
		"WRITE",
		"DELETE",
	}[o]
}

const (
	Create Op = iota // file created.
	Write            // file was written to.
	Delete           // file was deleted.
)

// EventBatch published by [Watcher] when changes to Go source files are
// detected within watched directories.
type EventBatch struct {
	Events map[string]Op // map of file paths and operations.
}

func newEventBatch() *EventBatch {
	return &EventBatch{
		Events: make(map[string]Op),
	}
}

// Paths returns unique file paths in event batch.
func (e EventBatch) Paths() []string {
	paths := make([]string, 0, len(e.Events))

	for path := range e.Events {
		paths = append(paths, path)
	}

	return paths
}

func (e *EventBatch) add(path string, op Op) {
	if _, ok := e.Events[path]; ok {
		return
	}

	e.Events[path] = op
}
