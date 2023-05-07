package gokiburi

import (
	"fmt"
	"runtime"
	"time"
)

const versionTemplate = `{{with .Name}}{{printf "%%s:" .}}{{end}}
  Version:    {{printf "%%s" .Version}}
  Go Version: %s
  Git Commit: %s
  Released:   %s
  OS/Arch:    %s
`

// Build information set by the compiler.
var (
	buildVersion   = ""
	buildTime      = ""
	buildCommit    = ""
	buildGoVersion = ""
	buildGoOSArch  = ""
)

// Version of the application.
//
// Returns `0.0.0-dev` if no version is set.
func Version() string {
	if buildVersion == "" {
		return "0.0.0-dev"
	}

	return buildVersion
}

// VersionTemplate for the Cobra CLI framework.
func VersionTemplate() string {
	return fmt.Sprintf(versionTemplate,
		BuildGoVersion(), BuildCommit(), BuildTime(), BuildGoOSArch(),
	)
}

func BuildTime() string {
	if buildTime == "" {
		return time.Now().UTC().Format(time.RFC3339)
	}

	return buildTime
}

func BuildCommit() string {
	if buildCommit == "" {
		return "HEAD"
	}

	return buildCommit
}

func BuildGoVersion() string {
	if buildGoVersion == "" {
		return runtime.Version()
	}

	return buildGoVersion
}

func BuildGoOSArch() string {
	if buildGoOSArch == "" {
		return runtime.GOOS + "/" + runtime.GOARCH
	}

	return buildGoOSArch
}
