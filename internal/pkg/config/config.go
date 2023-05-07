package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/invopop/validation"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	configName = "gokiburi"
	envPrefix  = "gokiburi"
	envVPDebug = "GOKIBURI_DEBUG_VIPER"
)

var shuffleRegexp = regexp.MustCompile(`^(on|off|\d+)$`)

// Config for the application.
type Config struct {
	CfgFile       string
	UseViper      bool `mapstructure:"viper"`
	Debug         bool
	JSON          bool
	Quiet         bool
	Shuffle       string
	Covermode     string
	RaceDetection bool `mapstructure:"race"`
	Short         bool
	Timeout       time.Duration
	Run           string
	Skip          string
	SkipPaths     []string `mapstructure:"skip-paths"`
	ListenAddress string   `mapstructure:"listen-address"`
	ListenPort    int      `mapstructure:"listen-port"`
}

// Validate configuration.
func (c Config) Validate() error {
	return validation.ValidateStruct(&c,
		validation.Field(&c.Shuffle, validation.Match(shuffleRegexp).
			Error("must be on, off, or a number")),
		validation.Field(&c.Covermode, validation.In("set", "count", "atomic").
			Error("must be one of set, count, or atomic")),
		validation.Field(&c.ListenPort, validation.Min(0), validation.Max(65535)),
	)
}

// Load configuration with flag values from command.
//
// Looks for viper configuration files at the current location, in order:
//
//   - Current working directory
//   - `gokiburi` directory inside directory returned by [os.UserConfigDir]
//   - /etc/gokiburi/
//
// the configuration file must be named `gokiburi` and have an extension
// supported by Viper, e.g. `yml`, `toml`, or `json`.
//
// If a command line flag is set, it will override the value will take
// precedence over the configuration file value.
func Load(cmd *cobra.Command) (*Config, error) {
	cfg := &Config{}

	if err := cfg.Load(cmd); err != nil {
		return nil, fmt.Errorf("loading configuration: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return cfg, nil
}

// Load configuration with flag values from command.
//
// Looks for viper configuration files at the current location, in order:
//
//   - Current working directory
//   - `gokiburi` directory inside directory returned by [os.UserConfigDir]
//   - /etc/gokiburi/
//
// the configuration file must be named `gokiburi` and have an extension
// supported by Viper, e.g. `yml`, `toml`, or `json`.
//
// If a command line flag is set, the value will take precedence over the
// configuration file value.
func (c *Config) Load(cmd *cobra.Command) error {
	v := viper.New()

	if err := v.BindPFlag("useViper", cmd.Flag("viper")); err != nil {
		return fmt.Errorf("binding viper flag: %w", err)
	}

	if err := v.BindPFlags(cmd.PersistentFlags()); err != nil {
		return fmt.Errorf("binding persistent command flags: %w", err)
	}

	if err := v.BindPFlags(cmd.Flags()); err != nil {
		return fmt.Errorf("binding command flags: %w", err)
	}

	if err := c.readInConfig(v); err != nil {
		return err
	}

	c.CfgFile = v.ConfigFileUsed()

	if _, ok := os.LookupEnv(envVPDebug); ok {
		v.Debug()
	}

	if err := v.Unmarshal(c); err != nil {
		return fmt.Errorf("unmarshaling viper: %w", err)
	}

	return nil
}

func (*Config) readInConfig(v *viper.Viper) error {
	cfgDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Errorf("getting user configuration directory: %w", err)
	}

	v.SetConfigName(configName)
	v.AddConfigPath(".")
	v.AddConfigPath(filepath.Join(cfgDir, configName))
	v.AddConfigPath(filepath.Join("/etc", configName))

	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer("-", "_"))

	if err = v.ReadInConfig(); err != nil {
		if errors.As(err, &viper.ConfigFileNotFoundError{}) {
			return nil
		}

		return fmt.Errorf("reading configuration file %q: %w", v.ConfigFileUsed(), err)
	}

	return nil
}
