package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/cristalhq/jwt"
	"github.com/mattermost/mattermost-server/model"
	"github.com/mattermost/mattermost-server/plugin"
)

const (
	POST_MEETING_KEY = "post_meeting_"
)

type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *Plugin) OnActivate() error {
	config := p.getConfiguration()
	if err := config.IsValid(); err != nil {
		return err
	}

	return nil
}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch path := r.URL.Path; path {
	case "/api/v1/meetings":
		p.handleStartMeeting(w, r)
	default:
		http.NotFound(w, r)
	}
}

type StartMeetingRequest struct {
	ChannelId string `json:"channel_id"`
	Personal  bool   `json:"personal"`
	Topic     string `json:"topic"`
	MeetingId int    `json:"meeting_id"`
}

// Claims extents cristalhq/jwt standard claims to add jitsi-web-token specific fields
type Claims struct {
	jwt.StandardClaims
	Room string `json:"room,omitempty"`
}

// MarshalBinary default marshaling to JSON.
func (c Claims) MarshalBinary() (data []byte, err error) {
	return json.Marshal(c)
}

func encodeJitsiMeetingID(meeting string) string {
	reg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		log.Fatal(err)
	}
	return reg.ReplaceAllString(meeting, "")
}

func (p *Plugin) handleStartMeeting(w http.ResponseWriter, r *http.Request) {
	if err := p.getConfiguration().IsValid(); err != nil {
		http.Error(w, err.Error(), http.StatusTeapot)
		return
	}

	userId := r.Header.Get("Mattermost-User-Id")

	if userId == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	var req StartMeetingRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var user *model.User
	var err *model.AppError
	user, err = p.API.GetUser(userId)
	if err != nil {
		http.Error(w, err.Error(), err.StatusCode)
	}

	if _, err := p.API.GetChannelMember(req.ChannelId, user.Id); err != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var meetingID string
	meetingID = encodeJitsiMeetingID(req.Topic)
	if len(req.Topic) < 1 {
		meetingID = generateRoomWithoutSeparator()
	}
	jitsiURL := strings.TrimSpace(p.getConfiguration().JitsiURL)
	jitsiURL = strings.TrimRight(jitsiURL, "/")
	meetingURL := jitsiURL + "/" + meetingID

	var meetingLinkValidUntil = time.Time{}
	JWTMeeting := p.getConfiguration().JitsiJWT

	if JWTMeeting {
		signer, err2 := jwt.NewHS256([]byte(p.getConfiguration().JitsiAppSecret))
		if err2 != nil {
			log.Printf("Error generating new HS256 signer: %v", err2)
			http.Error(w, "Internal error", http.StatusInternalServerError)
			return
		}
		builder := jwt.NewTokenBuilder(signer)

		// Error check is done in configuration.IsValid()
		jURL, _ := url.Parse(p.getConfiguration().JitsiURL)

		meetingLinkValidUntil = time.Now().Add(time.Duration(p.getConfiguration().JitsiLinkValidTime) * time.Minute)

		claims := Claims{}
		claims.Issuer = p.getConfiguration().JitsiAppID
		claims.Audience = []string{p.getConfiguration().JitsiAppID}
		claims.ExpiresAt = jwt.Timestamp(meetingLinkValidUntil.Unix())
		claims.Subject = jURL.Hostname()
		claims.Room = meetingID

		token, err2 := builder.Build(claims)
		if err2 != nil {
			log.Printf("Error building JWT: %v", err2)
			http.Error(w, "Internal error", http.StatusInternalServerError)
			return
		}

		meetingURL = meetingURL + "?jwt=" + string(token.Raw())
	}

	post := &model.Post{
		UserId:    user.Id,
		ChannelId: req.ChannelId,
		Message:   fmt.Sprintf("Meeting started at %s.", meetingURL),
		Type:      "custom_jitsi",
		Props: map[string]interface{}{
			"meeting_id":              meetingID,
			"meeting_link":            meetingURL,
			"jwt_meeting":             JWTMeeting,
			"jwt_meeting_valid_until": meetingLinkValidUntil.Format("2006-01-02 15:04:05 Z07:00"),
			"meeting_personal":        false,
			"meeting_topic":           req.Topic,
			"from_webhook":            "true",
			"override_username":       "Jitsi",
			"override_icon_url":       "https://s3.amazonaws.com/mattermost-plugin-media/Zoom+App.png",
		},
	}

	if _, err := p.API.CreatePost(post); err != nil {
		http.Error(w, err.Error(), err.StatusCode)
		return
	}

	err = p.API.KVSet(fmt.Sprintf("%v%v", POST_MEETING_KEY, meetingID), []byte(post.Id))
	if err != nil {
		http.Error(w, err.Error(), err.StatusCode)
		return
	}

	w.Write([]byte(fmt.Sprintf("%v", meetingID)))
}
