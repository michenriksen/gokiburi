package ciutil

import (
	"fmt"
	"os"
)

const (
	reset  = "\033[0m"
	red    = "\033[31m"
	green  = "\033[32m"
	yellow = "\033[33m"
	blue   = "\033[34m"
	purple = "\033[35m"
	cyan   = "\033[36m"
	white  = "\033[37m"
	bold   = "\033[1m"
)

func PrintFatal(format string, args ...any) {
	PrintError(format, args...)
	os.Exit(1) //nolint:revive // Not a library.
}

func PrintError(format string, args ...any) {
	fmt.Printf("%s%s%s", red, fmt.Sprintf(format, args...), reset)
}

func PrintWarning(format string, args ...any) {
	fmt.Printf("%s%s%s", yellow, fmt.Sprintf(format, args...), reset)
}

func PrintSuccess(format string, args ...any) {
	fmt.Printf("%s%s%s", green, fmt.Sprintf(format, args...), reset)
}

func PrintStatus(format string, args ...any) {
	fmt.Printf(" %s»%s %s%s%s", blue, reset, bold, fmt.Sprintf(format, args...), reset)
}
