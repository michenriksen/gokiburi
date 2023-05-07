package config_test

import (
	"testing"
	"time"

	"github.com/invopop/validation"

	"github.com/michenriksen/gokiburi/internal/pkg/config"

	"github.com/spf13/cobra"
	"github.com/stretchr/testify/require"
)

func TestLoad(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.PersistentFlags().Bool("viper", false, "")
	cmd.PersistentFlags().Bool("debug", true, "")
	cmd.PersistentFlags().Bool("json", true, "")
	cmd.PersistentFlags().Bool("quiet", true, "")
	cmd.Flags().String("shuffle", "on", "")
	cmd.Flags().String("covermode", "count", "")
	cmd.Flags().Bool("race", true, "")
	cmd.Flags().Bool("short", true, "")
	cmd.Flags().Duration("timeout", 42*time.Second, "")
	cmd.Flags().StringSlice("skip-paths", []string{"path1", "path2"}, "")
	cmd.Flags().String("listen-address", "127.0.0.1", "")
	cmd.Flags().Int("listen-port", 8080, "")

	cfg, err := config.Load(cmd)

	require.NoError(t, err)
	require.True(t, cfg.Debug)
	require.True(t, cfg.JSON)
	require.True(t, cfg.Quiet)
	require.Equal(t, "on", cfg.Shuffle)
	require.Equal(t, "count", cfg.Covermode)
	require.True(t, cfg.RaceDetection)
	require.True(t, cfg.Short)
	require.Equal(t, 42*time.Second, cfg.Timeout)
	require.Equal(t, []string{"path1", "path2"}, cfg.SkipPaths)
	require.Equal(t, "127.0.0.1", cfg.ListenAddress)
	require.Equal(t, 8080, cfg.ListenPort)
}

func TestLoad_NumericShuffleValue(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.Flags().Bool("viper", false, "")
	cmd.Flags().String("shuffle", "1337", "")

	cfg, err := config.Load(cmd)

	require.NoError(t, err)
	require.NotNil(t, cfg)
	require.Equal(t, "1337", cfg.Shuffle)
}

func TestLoad_InvalidShuffleValue(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.Flags().Bool("viper", false, "")
	cmd.Flags().String("shuffle", "wut", "")

	cfg, err := config.Load(cmd)

	var errs validation.Errors
	require.ErrorAs(t, err, &errs)

	require.Equal(t, "Shuffle: must be on, off, or a number.", errs.Error())
	require.Nil(t, cfg)
}

func TestLoad_InvalidCovermodeValue(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.Flags().Bool("viper", false, "")
	cmd.Flags().String("covermode", "lol", "")

	cfg, err := config.Load(cmd)

	var errs validation.Errors
	require.ErrorAs(t, err, &errs)

	require.Equal(t, "Covermode: must be one of set, count, or atomic.", errs.Error())
	require.Nil(t, cfg)
}

func TestLoad_ListenPortLessThanZero(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.Flags().Bool("viper", false, "")
	cmd.Flags().String("listen-port", "-1", "")

	cfg, err := config.Load(cmd)

	var errs validation.Errors
	require.ErrorAs(t, err, &errs)

	require.Equal(t, "ListenPort: must be no less than 0.", errs.Error())
	require.Nil(t, cfg)
}

func TestLoad_ListenPortTooHigh(t *testing.T) {
	cmd := &cobra.Command{}
	cmd.Flags().Bool("viper", false, "")
	cmd.Flags().String("listen-port", "65536", "")

	cfg, err := config.Load(cmd)

	var errs validation.Errors
	require.ErrorAs(t, err, &errs)

	require.Equal(t, "ListenPort: must be no greater than 65535.", errs.Error())
	require.Nil(t, cfg)
}
