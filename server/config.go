package main

import (
	"fmt"
)

type Configuration struct {
	JitsiURL       string
}

func (c *Configuration) IsValid() error {
	if len(c.JitsiURL) == 0 {
		return fmt.Errorf("JitsiURL is not configured.")
	}

	return nil
}
