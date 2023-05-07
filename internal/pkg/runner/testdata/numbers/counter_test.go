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
