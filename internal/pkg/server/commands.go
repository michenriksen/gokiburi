package server

// Instruction from user to the App.
type Instruction int

const (
	Pause Instruction = iota
	Resume
	RunTests
)

// Command from user to the App.
type Command struct {
	Instruction Instruction
	Data        string
}

func newCommand(instruction Instruction, data string) *Command {
	return &Command{
		Instruction: instruction,
		Data:        data,
	}
}
