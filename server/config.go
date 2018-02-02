package main

import (
	"fmt"
)

type Configuration struct {
	ZoomURL       string
	ZoomAPIURL    string
	APIKey        string
	APISecret     string
	WebhookSecret string
}

func (c *Configuration) IsValid() error {
	if len(c.APIKey) == 0 {
		return fmt.Errorf("APIKey is not configured.")
	} else if len(c.APISecret) == 0 {
		return fmt.Errorf("APISecret is not configured.")
	} else if len(c.WebhookSecret) == 0 {
		return fmt.Errorf("WebhookSecret is not configured.")
	}

	return nil
}
