package gokiburi

import "github.com/charmbracelet/log"

// Initializer initializes part of an [App].
type Initializer func(*App) error

// InitLogger for [App].
//
// Initializes the app logger configured according to the app configuration.
func InitLogger(app *App) error {
	log.InfoLevelStyle = logInfoLevelStyle
	log.WarnLevelStyle = logWarnLevelStyle
	log.ErrorLevelStyle = logErrorLevelStyle
	log.FatalLevelStyle = logFatalLevelStyle
	log.KeyStyle = logKeyStyle
	log.PrefixStyle = logPrefixStyle

	level := log.InfoLevel

	if app.config.Debug {
		level = log.DebugLevel
	} else if app.config.Quiet {
		level = log.WarnLevel
	}

	app.logger = log.NewWithOptions(app.stdout, log.Options{
		Level:           level,
		ReportCaller:    app.config.Debug,
		ReportTimestamp: true,
		Prefix:          "gokiburi",
	})

	if app.config.JSON {
		app.logger.SetFormatter(log.JSONFormatter)
	}

	return nil
}
