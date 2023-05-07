package root

import (
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/michenriksen/gokiburi/internal/gokiburi"
	"github.com/michenriksen/gokiburi/internal/pkg/config"

	"github.com/spf13/cobra"
)

// Run root command.
func Run() {
	cobra.CheckErr(Build().Execute())
}

// Build root command.
//
// Registers usage information and command flags.
func Build() *cobra.Command {
	app := gokiburi.New()

	cmd := &cobra.Command{
		Use:     "gokiburi [flags] [dir]",
		Version: gokiburi.Version(),
		Args:    cobra.RangeArgs(0, 1),
		PreRun: func(cmd *cobra.Command, args []string) {
			cfg, err := config.Load(cmd)
			cobra.CheckErr(err)

			dir, err := os.Getwd()
			cobra.CheckErr(err)

			if len(args) == 1 {
				dir, err = filepath.Abs(args[0])
				cobra.CheckErr(err)
			}

			cobra.CheckErr(app.Init(cfg, dir, gokiburi.InitLogger))

			c := make(chan os.Signal, 1)
			signal.Notify(c, os.Interrupt, syscall.SIGTERM)

			go func() {
				<-c
				app.Cancel()
				os.Exit(1) //nolint:revive // call to `os.Exit` is intended here.
			}()
		},
		Run: func(cmd *cobra.Command, args []string) {
			app.Run()
		},
	}

	cmd.PersistentFlags().Bool("viper", true, "use Viper for configuration")
	cmd.PersistentFlags().Bool("debug", false, "log debugging information")
	cmd.PersistentFlags().Bool("json", false, "log in JSON format")
	cmd.PersistentFlags().Bool("quiet", false, "log only warnings and errors")

	cmd.Flags().String("shuffle", "off", "randomize the execution order of tests (off,on,N)")
	cmd.Flags().String("covermode", "count", "mode for coverage analysis (set,count,atomic)")
	cmd.Flags().Bool("race", false, "enable data race detector")
	cmd.Flags().Bool("short", false, "tell long-running tests to shorten their runtime")
	cmd.Flags().Duration("timeout", 10*time.Minute, "timeout for test runs")
	cmd.Flags().StringSlice("skip-paths", nil, "additional paths for watcher to skip")
	cmd.Flags().String("listen-address", "127.0.0.1", "address to run web server on")
	cmd.Flags().Int("listen-port", 9393, "port to run web server on")

	cmd.SetVersionTemplate(gokiburi.VersionTemplate())

	return cmd
}
