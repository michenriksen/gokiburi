package coverparser

import (
	"time"
)

// Mode of a coverage report.
type Mode string

// Coverage modes supported by Go.
const (
	ModeSet    Mode = "set"    // does this statement run?
	ModeCount  Mode = "count"  // how many times does this statement run?
	ModeAtomic Mode = "atomic" // like count, but correct in multithreaded tests.
)

// Report of code coverage in a test run.
//
// Holds coverage profile data and contents of tested files.
type Report struct {
	Mode     Mode      `json:"mode"`
	Profiles []Profile `json:"profiles"`
	Time     time.Time `json:"time"`
}

// Profile of a single file in coverage report.
type Profile struct {
	FileName   string            `json:"filename"`   // Name of file.
	Package    string            `json:"package"`    // Package where file belongs.
	Path       string            `json:"path"`       // Absolute path to file.
	Content    []byte            `json:"content"`    // Content of file at time of testing.
	Size       int               `json:"size"`       // File size.
	Coverage   float64           `json:"coverage"`   // Coverage percentage of file.
	LineCount  int               `json:"lineCount"`  // Number of lines in file.
	Boundaries []ProfileBoundary `json:"boundaries"` // Boundaries map coverage of the content.
}

// ProfileBoundary represents the position in a source file of the beginning
// and end of a block as reported by the coverage profile.
//
// User interfaces can use this to mark coverage of a file, e.g. by wrapping
// file content in HTML tags between start and end offsets.
type ProfileBoundary struct {
	Offset int     `json:"offset"` // Location as a byte offset in the content.
	Start  bool    `json:"start"`  // Is this the start of a block?
	Count  int     `json:"count"`  // Amount of times block was invoked in tests.
	Norm   float64 `json:"norm"`   // Coverage normalized to [0..1].
	Index  int     `json:"index"`  // Order in content.
}

// pkg describes a single package, compatible with the JSON output from 'go list'; see 'go help list'.
type pkg struct {
	ImportPath string
	Dir        string
	Error      *struct {
		Err string
	}
}
