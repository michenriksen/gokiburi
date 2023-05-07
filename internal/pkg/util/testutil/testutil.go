package testutil

import (
	"os"
	"testing"
)

const IntegrationTestEnv = "TEST_INTEGRATION"

// SetIntegrationTest skips the test if the TEST_INTEGRATION environment
// variable is not set.
func SetIntegrationTest(t *testing.T) {
	t.Helper()

	if _, ok := os.LookupEnv(IntegrationTestEnv); !ok {
		t.Skipf("skipping integration test; set %q environment variable to run", IntegrationTestEnv)
	}
}
