package runner_test

import (
	"context"
	"os"
	"path"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/michenriksen/gokiburi/internal/pkg/command"
	"github.com/michenriksen/gokiburi/internal/pkg/runner"
	"github.com/michenriksen/gokiburi/internal/pkg/util/testutil"
)

const testTarget = "./..."

func TestRunner_Run(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput.json"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.False(t, result.Pass)
	require.Equal(t, 3, result.Tests)
	require.Equal(t, 1, result.Passed)
	require.Equal(t, 1, result.Skipped)
	require.Equal(t, 1, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))
	require.False(t, pkg.Pass)
	require.Equal(t, 1, pkg.Passed)
	require.Equal(t, 1, pkg.Skipped)
	require.Equal(t, 1, pkg.Failed)
	require.Len(t, pkg.Tests, 3)
	require.Equal(t, 0.29, pkg.Elapsed)
	require.Equal(t, 66.7, pkg.Coverage)

	passed := testByName(t, "TestIntMinBasic", pkg.Tests)
	skipped := testByName(t, "TestIntMinTableDriven", pkg.Tests)
	failed := testByName(t, "TestIntMinFailing", pkg.Tests)

	require.Equal(t, pkg.Name, passed.Package)
	require.True(t, passed.Pass)
	require.False(t, passed.Skip)
	require.Equal(t, 0.0, passed.Elapsed)
	require.Equal(t, "=== RUN   TestIntMinBasic\n--- PASS: TestIntMinBasic (0.00s)\n", passed.Output)

	require.Equal(t, pkg.Name, skipped.Package)
	require.False(t, skipped.Pass)
	require.True(t, skipped.Skip)
	require.Equal(t, 0.0, skipped.Elapsed)
	require.Equal(t, "=== RUN   TestIntMinTableDriven\n    numbers_test.go:16: skipping table driven test\n--- SKIP: TestIntMinTableDriven (0.00s)\n", skipped.Output)

	require.Equal(t, pkg.Name, failed.Package)
	require.False(t, failed.Pass)
	require.False(t, failed.Skip)
	require.Equal(t, 0.0, failed.Elapsed)
	require.Equal(t, "=== RUN   TestIntMinFailing\n    numbers_test.go:41: failing test\n--- FAIL: TestIntMinFailing (0.00s)\n", failed.Output)
}

// TestRunner_Run_Integration runs the actual tests inside ./testdata/ and
// asserts that results are as expected.
func TestRunner_Run_Integration(t *testing.T) {
	testutil.SetIntegrationTest(t)

	r := runner.New(context.Background(), "./testdata",
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.False(t, result.Pass)
	require.Equal(t, 4, result.Tests)
	require.Equal(t, 2, result.Passed)
	require.Equal(t, 1, result.Skipped)
	require.Equal(t, 1, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))
	require.False(t, pkg.Pass)
	require.Equal(t, 2, pkg.Passed)
	require.Equal(t, 1, pkg.Skipped)
	require.Equal(t, 1, pkg.Failed)
	require.Len(t, pkg.Tests, 4)
	require.NotZero(t, pkg.Elapsed)
	require.Equal(t, 80.0, pkg.Coverage)

	passed := testByName(t, "TestIntMinBasic", pkg.Tests)
	skipped := testByName(t, "TestIntMinTableDriven", pkg.Tests)
	failed := testByName(t, "TestIntMinFailing", pkg.Tests)

	require.Equal(t, pkg.Name, passed.Package)
	require.True(t, passed.Pass)
	require.False(t, passed.Skip)
	require.Equal(t, "=== RUN   TestIntMinBasic\n--- PASS: TestIntMinBasic (0.00s)\n", passed.Output)

	require.Equal(t, pkg.Name, skipped.Package)
	require.False(t, skipped.Pass)
	require.True(t, skipped.Skip)
	require.Equal(t, "=== RUN   TestIntMinTableDriven\n    numbers_test.go:16: skipping table driven test\n--- SKIP: TestIntMinTableDriven (0.00s)\n", skipped.Output)

	require.Equal(t, pkg.Name, failed.Package)
	require.False(t, failed.Pass)
	require.False(t, failed.Skip)
	require.Equal(t, "=== RUN   TestIntMinFailing\n    numbers_test.go:41: failing test\n--- FAIL: TestIntMinFailing (0.00s)\n", failed.Output)
}

func TestRunner_Run_Timeout(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput-timeout.json"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.False(t, result.Pass)
	require.Equal(t, 2, result.Tests)
	require.Equal(t, 1, result.Passed)
	require.Equal(t, 0, result.Skipped)
	require.Equal(t, 1, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))

	passed := testByName(t, "TestCounterIncrement", pkg.Tests)
	failed := testByName(t, "TestCounterTimesOut", pkg.Tests)

	require.Equal(t, pkg.Name, passed.Package)
	require.True(t, passed.Pass)
	require.False(t, passed.Skip)
	require.False(t, passed.Timeout)

	require.Equal(t, pkg.Name, failed.Package)
	require.False(t, failed.Pass)
	require.False(t, failed.Skip)
	require.True(t, failed.Timeout)
	require.Contains(t, failed.Output, "panic: test timed out after 500ms")
	require.Contains(t, failed.Output, "goroutine 135 [sleep]:\ntime.Sleep(0x3b9aca00)\n")
}

func TestRunner_Run_NoTests(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput-no-tests.json"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.True(t, result.Pass)
	require.Equal(t, 0, result.Tests)
	require.Equal(t, 0, result.Passed)
	require.Equal(t, 0, result.Skipped)
	require.Equal(t, 0, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))
	require.True(t, pkg.Pass)
	require.Equal(t, 0, pkg.Passed)
	require.Equal(t, 0, pkg.Skipped)
	require.Equal(t, 0, pkg.Failed)
	require.Len(t, pkg.Tests, 0)
	require.Equal(t, 0.0, pkg.Elapsed)
	require.Equal(t, 0.0, pkg.Coverage)
}

func TestRunner_Run_AllPass(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput-all-pass.json"), 0, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.True(t, result.Pass)
	require.Equal(t, 7, result.Tests)
	require.Equal(t, 7, result.Passed)
	require.Equal(t, 0, result.Skipped)
	require.Equal(t, 0, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))
	require.True(t, pkg.Pass)
	require.Equal(t, 7, pkg.Passed)
	require.Equal(t, 0, pkg.Skipped)
	require.Equal(t, 0, pkg.Failed)
	require.Len(t, pkg.Tests, 7)
	require.Equal(t, 0.0, pkg.Elapsed)
	require.Equal(t, 100.0, pkg.Coverage)
}

func TestRunner_Run_DataRace(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput-data-race.json"), 66, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Empty(t, result.Error)
	require.False(t, result.Pass)
	require.Equal(t, 1, result.Tests)
	require.Equal(t, 0, result.Passed)
	require.Equal(t, 0, result.Skipped)
	require.Equal(t, 1, result.Failed)
	require.Len(t, result.Packages, 1)

	pkg := result.Packages[0]

	require.True(t, strings.HasSuffix(pkg.Name, "testdata/numbers"))
	require.False(t, pkg.Pass)
	require.Equal(t, 0, pkg.Passed)
	require.Equal(t, 0, pkg.Skipped)
	require.Equal(t, 1, pkg.Failed)
	require.Len(t, pkg.Tests, 1)
	require.Equal(t, 0.258, pkg.Elapsed)
	require.Equal(t, 40.0, pkg.Coverage)

	failed := testByName(t, "TestCounterIncrement", pkg.Tests)

	require.Equal(t, pkg.Name, failed.Package)
	require.False(t, failed.Pass)
	require.False(t, failed.Skip)
	require.Contains(t, failed.Output, "WARNING: DATA RACE")
	require.Contains(t, failed.Output, "Read at 0x00c0000182e8")
	require.Contains(t, failed.Output, "Previous write at 0x00c0000182e8")
	require.Contains(t, failed.Output, "race detected during execution of test")
}

func TestRunner_Run_BuildFailed(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput-build-failed.txt"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.Equal(t, "build failed", result.Error)
	require.Nil(t, err)

	defer func() {
		if dir := result.Dir(); dir != "" {
			os.RemoveAll(dir)
		}
	}()

	require.Equal(t, "deadbeef", result.UUID)
	require.Equal(t, []string{testTarget}, result.Targets)
	require.NotZero(t, result.Duration)
	require.Equal(t, "build failed", result.Error)
	require.False(t, result.Pass)
	require.Equal(t, 0, result.Tests)
	require.Equal(t, 0, result.Passed)
	require.Equal(t, 0, result.Skipped)
	require.Equal(t, 0, result.Failed)
	require.Len(t, result.Packages, 0)
}

func TestRunner_Run_FlagConfig(t *testing.T) {
	mockRf := func(ctx context.Context, dir, name string, args ...string) ([]byte, int, error) {
		if args[0] == "list" {
			return []byte(testTarget), 0, nil
		}

		argStr := strings.Join(args, " ")
		require.Contains(t, argStr, " -short ")
		require.Contains(t, argStr, " -shuffle on ")
		require.Contains(t, argStr, " -race ")
		require.Contains(t, argStr, " -timeout 10s ")

		return testutil.ReadFile(t, "testdata", "testoutput.json"), 0, nil
	}

	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(mockRf),
		runner.WithShort(true),
		runner.WithShuffle("on"),
		runner.WithRaceDetection(true),
		runner.WithTimeout(10*time.Second),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)
}

func TestResult_Close(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput.json"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	require.DirExists(t, result.Dir())
	require.NoError(t, result.Close())
	require.NoDirExists(t, result.Dir())
	require.Empty(t, result.Dir())
}

func TestResult_Close_DirAlreadyRemoved(t *testing.T) {
	runnerFunc := mockRunnerFunc(t, testutil.ReadFile(t, "testdata", "testoutput.json"), 1, nil)
	r := runner.New(context.Background(), "./testdata",
		runner.WithRunnerFunc(runnerFunc),
		runner.WithUUIDFunc(mockUUIDFunc),
	)

	result, err := r.Run(testTarget)

	require.NoError(t, err)
	require.NotNil(t, result)

	require.DirExists(t, result.Dir())
	require.NoError(t, os.RemoveAll(result.Dir()))
	require.NoError(t, result.Close())
	require.Empty(t, result.Dir())
}

func mockUUIDFunc() (string, error) {
	return "deadbeef", nil
}

func mockRunnerFunc(t *testing.T, out []byte, exitCode int, returnErr error) command.Runner {
	t.Helper()

	return func(ctx context.Context, dir, name string, args ...string) ([]byte, int, error) {
		if args[0] == "list" {
			return []byte(testTarget), 0, nil
		}

		var cpDest string

		// Find destination for the coverage profile.
		for i, arg := range args {
			if arg == "-coverprofile" {
				cpDest = args[i+1]
				break
			}
		}

		if cpDest == "" {
			t.Fatal("coverprofile arg not found")
		}

		cp, err := os.ReadFile(path.Join("testdata", "coverprofile.out"))
		if err != nil {
			t.Fatalf("error reading testdata cover profile: %v", err)
		}

		if err := os.WriteFile(cpDest, cp, 0o644); err != nil {
			t.Fatalf("error writing coverage file to %q: %v", cpDest, err)
		}

		return out, exitCode, returnErr
	}
}

func testByName(t *testing.T, name string, tests []*runner.Test) *runner.Test {
	t.Helper()

	for _, test := range tests {
		if test.Name == name {
			return test
		}
	}

	t.Fatalf("could not find test %q", name)

	return nil
}
