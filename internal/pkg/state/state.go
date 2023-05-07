package state

import "encoding/json"

// State of the application.
type State int

const (
	Init    State = iota // Initializing components.
	Ready                // Ready and waiting to run tests.
	Paused               // Automatic test runs is paused.
	Running              // Test run is in progress.
	Closing              // Shutting down.
)

// MarshalJSON marshals State to a text representation.
func (s State) MarshalJSON() ([]byte, error) {
	return json.Marshal(s.String())
}

// String representation of State.
func (s State) String() string {
	return [...]string{
		"init",
		"ready",
		"paused",
		"running",
		"closing",
	}[s]
}
