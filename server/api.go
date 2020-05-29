package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

type StartMeetingRequest struct {
	ChannelID string `json:"channel_id"`
	Personal  bool   `json:"personal"`
	Topic     string `json:"topic"`
	MeetingID int    `json:"meeting_id"`
}

type StartMeetingFromAction struct {
	model.PostActionIntegrationRequest
	Context struct {
		MeetingID    string `json:"meeting_id"`
		MeetingTopic string `json:"meeting_topic"`
		Personal     bool   `json:"personal"`
	} `json:"context"`
}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch path := r.URL.Path; path {
	case "/api/v1/meetings/enrich":
		p.handleEnrichMeetingJwt(w, r)
	case "/api/v1/meetings":
		p.handleStartMeeting(w, r)
	case "/api/v1/config":
		p.handleConfig(w, r)
	default:
		http.NotFound(w, r)
	}
}

func (p *Plugin) handleConfig(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-Id")

	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	config, err := p.getUserConfig(userID)
	if err != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	b, err2 := json.Marshal(config)
	if err2 != nil {
		log.Printf("Error marshaling the Config to json: %v", err2)
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}

func (p *Plugin) handleStartMeeting(w http.ResponseWriter, r *http.Request) {
	if err := p.getConfiguration().IsValid(); err != nil {
		http.Error(w, err.Error(), http.StatusTeapot)
		return
	}

	userID := r.Header.Get("Mattermost-User-Id")

	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	user, appErr := p.API.GetUser(userID)
	if appErr != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var req StartMeetingRequest
	var action StartMeetingFromAction

	bodyData, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err1 := json.NewDecoder(bytes.NewReader(bodyData)).Decode(&req)
	err2 := json.NewDecoder(bytes.NewReader(bodyData)).Decode(&action)
	if err1 != nil && err2 != nil {
		http.Error(w, "Unable to decode your request", http.StatusBadRequest)
		return
	}

	channelID := req.ChannelID
	if channelID == "" {
		channelID = action.ChannelId
	}

	if _, err := p.API.GetChannelMember(channelID, userID); err != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	channel, appErr := p.API.GetChannel(channelID)
	if appErr != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	userConfig, err := p.getUserConfig(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userConfig.NamingScheme == jitsiNameSchemaAsk && action.PostId == "" {
		err := p.askMeetingType(user, channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, _ = w.Write([]byte("OK"))
	} else {
		var meetingID string
		var err error
		if userConfig.NamingScheme == jitsiNameSchemaAsk && action.PostId != "" {
			meetingID, err = p.startMeeting(user, channel, action.Context.MeetingID, action.Context.MeetingTopic, action.Context.Personal)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			p.deleteEphemeralPost(action.UserId, action.PostId)
		} else {
			meetingID, err = p.startMeeting(user, channel, "", req.Topic, req.Personal)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		b, err2 := json.Marshal(map[string]string{"meeting_id": meetingID})
		if err2 != nil {
			log.Printf("Error marshaling the MeetingID to json: %v", err2)
			http.Error(w, "Internal error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write(b)
	}
}

func (p *Plugin) handleEnrichMeetingJwt(w http.ResponseWriter, r *http.Request) {
	if err := p.getConfiguration().IsValid(); err != nil {
		http.Error(w, err.Error(), http.StatusTeapot)
		return
	}

	userID := r.Header.Get("Mattermost-User-Id")
	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	var req EnrichMeetingJwtRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var user *model.User
	var err *model.AppError
	user, err = p.API.GetUser(userID)
	if err != nil {
		http.Error(w, err.Error(), err.StatusCode)
	}

	JWTMeeting := p.getConfiguration().JitsiJWT

	if !JWTMeeting {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	meetingJWT, err2 := p.updateJwtUserInfo(req.Jwt, user)
	if err2 != nil {
		log.Printf("Error updating JWT context: %v", err2)
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}

	b, err2 := json.Marshal(map[string]string{"jwt": meetingJWT})
	if err2 != nil {
		log.Printf("Error marshaling the JWT json: %v", err2)
		http.Error(w, "Internal error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}
