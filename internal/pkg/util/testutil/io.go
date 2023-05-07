package testutil

import (
	"os"
	"path"
	"testing"
)

// ReadFile reads a file and fails the test if an error occurs.
func ReadFile(t *testing.T, pathElems ...string) []byte {
	t.Helper()

	name := path.Join(pathElems...)

	data, err := os.ReadFile(name)
	if err != nil {
		t.Fatalf("error reading file %q: %v", name, err)
	}

	return data
}

// OpenFile opens a file for reading and fails the test if an error occurs.
func OpenFile(t *testing.T, pathElems ...string) *os.File {
	t.Helper()

	name := path.Join(pathElems...)

	f, err := os.Open(name)
	if err != nil {
		t.Fatalf("error opening file %q: %v", name, err)
	}

	return f
}
