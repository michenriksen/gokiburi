package numbers

import (
	"sync"
	"testing"
)

func TestCounterIncrement(t *testing.T) {
	c := &Counter{}
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Increment()
		}()
	}

	wg.Wait()

	if c.Value() != 100 {
		t.Errorf("Expected counter value to be 100, got %d", c.Value())
	}
}

// func TestCounterTimesOut was used to generate test data for a test run with
// a test timing out.
// func TestCounterTimesOut(t *testing.T) {
// 	time.Sleep(1 * time.Second)
// 	t.Error("Expected test to time out")
// }
