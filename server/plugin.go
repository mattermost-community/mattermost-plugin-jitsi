package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/mattermost/mattermost-server/model"
	"github.com/mattermost/mattermost-server/plugin"
)

const (
	POST_MEETING_KEY = "post_meeting_"
)

type Plugin struct {
	plugin.MattermostPlugin

	JitsiURL string
}

// func (p *Plugin) OnActivate() error {
// 	if err := p.IsConfigurationValid(); err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Plugin) OnConfigurationChange() error {
// 	if err := p.IsConfigurationValid(); err != nil {
// 		return err
// 	}

// 	return nil
// }

func (p *Plugin) IsConfigurationValid() error {
	if len(p.JitsiURL) == 0 {
		return fmt.Errorf("Jitsi URL is not configured")
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

func encodeJitsiMeetingID(meeting string) string {
	reg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		log.Fatal(err)
	}
	return reg.ReplaceAllString(meeting, "")
}

func (p *Plugin) handleStartMeeting(w http.ResponseWriter, r *http.Request) {
	if err := p.IsConfigurationValid(); err != nil {
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
	jitsiURL := strings.TrimSpace(p.JitsiURL)
	meetingURL := jitsiURL + "/" + meetingID

	post := &model.Post{
		UserId:    user.Id,
		ChannelId: req.ChannelId,
		Message:   fmt.Sprintf("Meeting started at %s.", meetingURL),
		Type:      "custom_jitsi",
		Props: map[string]interface{}{
			"meeting_id":        meetingID,
			"meeting_link":      meetingURL,
			"meeting_status":    "STARTED",
			"meeting_personal":  false,
			"meeting_topic":     req.Topic,
			"from_webhook":      "true",
			"override_username": "Jitsi",
			"override_icon_url": "https://s3.amazonaws.com/mattermost-plugin-media/Zoom+App.png",
		},
	}

	if post, err := p.API.CreatePost(post); err != nil {
		http.Error(w, err.Error(), err.StatusCode)
		return
	} else {
		err = p.API.KVSet(fmt.Sprintf("%v%v", POST_MEETING_KEY, meetingID), []byte(post.Id))
		if err != nil {
			http.Error(w, err.Error(), err.StatusCode)
			return
		}
	}

	w.Write([]byte(fmt.Sprintf("%v", meetingID)))
}
