package state_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/michenriksen/gokiburi/internal/pkg/state"
)

func TestState_MarshalJSON(t *testing.T) {
	tt := []struct {
		s    state.State
		want []byte
	}{
		{state.Init, []byte(`"init"`)},
		{state.Ready, []byte(`"ready"`)},
		{state.Paused, []byte(`"paused"`)},
		{state.Running, []byte(`"running"`)},
		{state.Closing, []byte(`"closing"`)},
	}

	for _, tc := range tt {
		t.Run(string(tc.want), func(t *testing.T) {
			b, err := tc.s.MarshalJSON()

			require.NoError(t, err)
			require.Equal(t, tc.want, b)
		})
	}
}
