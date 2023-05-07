package coverparser_test

import (
	"context"
	"math"
	"os"
	"path"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/michenriksen/gokiburi/internal/pkg/coverparser"
	"github.com/michenriksen/gokiburi/internal/pkg/util/testutil"
)

func TestParser_Parse(t *testing.T) {
	f := testutil.OpenFile(t, "testdata", "numbers", "coverprofile.out")
	defer f.Close()

	parser := coverparser.New(context.Background(), "./testdata")
	report, err := parser.Parse(f)
	require.NoError(t, err)

	expectedContent := testutil.ReadFile(t, "testdata", "numbers", "numbers.go")

	require.Equal(t, coverparser.ModeAtomic, report.Mode)
	require.NotZero(t, report.Time)
	require.Len(t, report.Profiles, 1)

	profile := report.Profiles[0]
	require.True(t, strings.HasSuffix(profile.FileName, "testdata/numbers/numbers.go"))
	require.True(t, strings.HasSuffix(profile.Path, "testdata/numbers/numbers.go"))
	require.True(t, strings.HasSuffix(profile.Package, "testdata/numbers"))
	require.Equal(t, float64(100), profile.Coverage)
	require.Equal(t, 11, profile.LineCount)
	require.Equal(t, len(expectedContent), profile.Size)
	require.Equal(t, expectedContent, profile.Content)
	require.Len(t, profile.Boundaries, 6) // 3 pairs of start/end boundaries.

	bb := profile.Boundaries

	// First boundary starts at opening `{` for `IntMin` function.
	require.Equal(t, 0, bb[0].Index)
	require.True(t, bb[0].Start)
	require.Equal(t, 156, bb[0].Offset)
	require.Equal(t, 5, bb[0].Count)
	require.Equal(t, 1.0, bb[0].Norm)

	// First boundary ends at opening `{` for `if a < b` condition.
	require.Equal(t, 1, bb[1].Index)
	require.False(t, bb[1].Start)
	require.Equal(t, 168, bb[1].Offset)
	require.Equal(t, 0, bb[1].Count)
	require.Equal(t, 0.0, bb[1].Norm)

	// Second boundary starts at opening `{` for `if a < b` condition.
	require.Equal(t, 2, bb[2].Index)
	require.True(t, bb[2].Start)
	require.Equal(t, 168, bb[2].Offset)
	require.Equal(t, 2, bb[2].Count)
	require.Equal(t, 0.43, math.Round(bb[2].Norm*100)/100)

	// Second boundary ends after `return a` statement.
	require.Equal(t, 3, bb[3].Index)
	require.False(t, bb[3].Start)
	require.Equal(t, 183, bb[3].Offset)
	require.Equal(t, 0, bb[3].Count)
	require.Equal(t, 0.0, bb[3].Norm)

	// Third boundary starts closing `}` for `if a < b` condition.
	require.Equal(t, 4, bb[4].Index)
	require.True(t, bb[4].Start)
	require.Equal(t, 185, bb[4].Offset)
	require.Equal(t, 3, bb[4].Count)
	require.Equal(t, 0.68, math.Round(bb[4].Norm*100)/100)

	// Third boundary ends after `return b` statement.
	require.Equal(t, 5, bb[5].Index)
	require.False(t, bb[5].Start)
	require.Equal(t, 193, bb[5].Offset)
	require.Equal(t, 0, bb[5].Count)
	require.Equal(t, 0.0, bb[5].Norm)
}

func TestParser_Parse_BadCoverprofile(t *testing.T) {
	f, err := os.Open(path.Join("testdata", "coverprofile.out.bad"))
	require.NoError(t, err)

	parser := coverparser.New(context.Background(), "./testdata")
	report, err := parser.Parse(f)

	require.ErrorContains(t, err, "parsing cover profile data:")
	require.Nil(t, report)
}

func TestParser_Parse_NoProfiles(t *testing.T) {
	parser := coverparser.New(context.Background(), "./testdata")
	report, err := parser.Parse(strings.NewReader("mode: atomic\n"))

	require.ErrorIs(t, err, coverparser.ErrNoProfiles)
	require.Nil(t, report)
}
