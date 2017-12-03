package zoom

import (
	"fmt"
	"time"
)

// The User object defined at https://zoom.github.io/api/#the-user-object.
type User struct {
	ID                string    `json:"id"`
	FirstName         string    `json:"first_name"`
	LastName          string    `json:"last_name"`
	Email             string    `json:"email"`
	Type              int       `json:"type"`
	Pmi               int       `json:"pmi"`
	Timezone          string    `json:"timezone"`
	Dept              string    `json:"dept"`
	CreatedAt         time.Time `json:"created_at"`
	LastLoginTime     time.Time `json:"last_login_time"`
	LastClientVersion string    `json:"last_client_version"`
	VanityURL         string    `json:"vanity_url"`
	Verified          int       `json:"verified"`
	PicURL            string    `json:"pic_url"`
}

func (c *Client) GetUser(userId string) (*User, *ClientError) {
	var ret User
	return &ret, c.request("GET", fmt.Sprintf("/users/%v", userId), "", &ret)
}
