package gokiburi

import (
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
)

var (
	logInfoLevelStyle = log.InfoLevelStyle.Copy().
				Foreground(lipgloss.AdaptiveColor{Light: "#7D79F6", Dark: "#514DC1"})

	logWarnLevelStyle = log.WarnLevelStyle.Copy().
				Foreground(lipgloss.AdaptiveColor{Light: "#FF8700", Dark: "#FFAF00"})

	logErrorLevelStyle = log.ErrorLevelStyle.Copy().
				Foreground(lipgloss.AdaptiveColor{Light: "#FF6F91", Dark: "#C74665"})

	logFatalLevelStyle = log.FatalLevelStyle.Copy().
				Foreground(lipgloss.AdaptiveColor{Light: "#FF4672", Dark: "#ED567A"})

	logKeyStyle = log.KeyStyle.Copy().
			Foreground(lipgloss.AdaptiveColor{Light: "#FFFDF5", Dark: "#FFFDF5"}).
			Bold(false)

	logPrefixStyle = log.PrefixStyle.Copy().
			Foreground(lipgloss.AdaptiveColor{Light: "#FFFDF5", Dark: "#FFFDF5"}).
			Bold(true)
)
