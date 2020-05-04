package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/cristalhq/jwt"
	"github.com/mattermost/mattermost-server/model"
	"github.com/mattermost/mattermost-server/plugin"
)

const (
	JITSI_COMMAND = "meet"
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

	if cerr := p.API.RegisterCommand(&model.Command{
		Trigger:          JITSI_COMMAND,
		AutoComplete:     true,
		AutoCompleteDesc: "Start a Jitsi meeting for the current channel. Optionally, append desired meeting topic after the command",
	}); cerr != nil {
		return cerr
	}

	return nil
}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/api/v1/meetings/gentoken":
		p.handleJWTRequest(w, r)
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

type GenerateMeetingJWTRequest struct {
	ChannelId      string `json:"channel_id"`
	MeetingId      string `json:"meeting_id"`
	MeetingOwnerId string `json:"owner_id"`
	DisplayName    string `json:"display_name"`
}

type GenerateMeetingJWTResponse struct {
	Token                 string `json:"jwt_token"`
	MeetingLinkValidUntil string `json:"jwt_meeting_valid_until"`
}

// Claims extents cristalhq/jwt standard claims to add jitsi-web-token specific fields
type ClaimsUser struct {
	Id        string `json:"id,omitempty"`
	Name      string `json:"name,omitempty"`
	AvatarUrl string `json:"avatar,omitempty"`
}

type ClaimsContext struct {
	User ClaimsUser `json:"user,omitempty"`
}

type Claims struct {
	jwt.StandardClaims
	Context     ClaimsContext `json:"context,omitempty"`
	Room        string        `json:"room,omitempty"`
	IsModerator bool          `json:"moderator,omitempty"`
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

func (p *Plugin) generateJWTToken(meetingID string, displayName string) (string, string, error) {

	var meetingLinkValidUntil = time.Time{}

	signer, herr := jwt.NewHS256([]byte(p.getConfiguration().JitsiAppSecret))
	if herr != nil {
		log.Printf("Error generating new HS256 signer: %v", herr)
		return "", "", errors.New("Internal error")
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

	if displayName != "" {
		claimsContext := ClaimsContext{User: ClaimsUser{}}
		claimsContext.User.Name = displayName
		claims.Context = claimsContext
	}

	token, berr := builder.Build(claims)
	if berr != nil {
		log.Printf("Error building JWT: %v", berr)
		return "", "", errors.New("Internal error")
	}

	return strconv.FormatInt(meetingLinkValidUntil.Unix(), 10), string(token.Raw()), nil
}

func (p *Plugin) startMeeting(userId string, channelId string, meetingTopic string) error {
	var meetingID string
	meetingID = encodeJitsiMeetingID(meetingTopic)
	if len(meetingID) < 1 {
		namingScheme := p.getConfiguration().JitsiNamingScheme

		var channelName string
		channel, channelErr := p.API.GetChannel(channelId)

		if channelErr != nil {
			channelName = "unknown-channel"
		} else {
			channelName = channel.Name
		}

		meetingID = generateNameFromSelectedScheme(namingScheme, channelName)
	}
	jitsiURL := strings.TrimSpace(p.getConfiguration().JitsiURL)
	jitsiURL = strings.TrimRight(jitsiURL, "/")
	meetingURL := jitsiURL + "/" + meetingID

	message := fmt.Sprintf("Meeting started at %s.", meetingURL)

	JWTMeeting := p.getConfiguration().JitsiJWT
	if JWTMeeting {
		_, anonymousMeetingToken, err := p.generateJWTToken(meetingID, "")
		if err != nil {
			return err
		}
		anonymousMeetingURL := meetingURL + "?jwt=" + anonymousMeetingToken
		message = fmt.Sprintf("Meeting started at %s. *This link includes a non-personalized access Token you see for compatibility reasons.* **Valid for %d minutes.**", anonymousMeetingURL, p.getConfiguration().JitsiLinkValidTime)
	}

	post := &model.Post{
		UserId:    userId,
		ChannelId: channelId,
		Message:   message,
		Type:      "custom_jitsi",
		Props: map[string]interface{}{
			"meeting_id":       meetingID,
			"meeting_link":     meetingURL,
			"jwt_meeting":      JWTMeeting,
			"meeting_personal": false,
			"meeting_topic":    meetingTopic,
		},
	}

	if _, err := p.API.CreatePost(post); err != nil {
		return err
	}

	return nil
}

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	input := strings.TrimSpace(strings.TrimPrefix(args.Command, "/"+JITSI_COMMAND))

	if err := p.startMeeting(args.UserId, args.ChannelId, input); err != nil {
		/*
			msg := &model.Post{
				UserId:    args.UserId,
				ChannelId: args.ChannelId,
				Message:   "We could not start a meeting at this time.",
				//Type:      "custom_jitsi",
				//Props: map[string]interface{}{},
			}
			p.API.SendEphemeralPost(args.UserId, msg)
		*/
		return &model.CommandResponse{
				ResponseType: model.COMMAND_RESPONSE_TYPE_EPHEMERAL,
				ChannelId:    args.ChannelId,
				Text:         "We could not start a meeting at this time.",
			}, &model.AppError{
				Message:       "We could not start a meeting at this time.",
				DetailedError: fmt.Sprintf("startMeeting() threw error: %s", err),
			}
	}

	return &model.CommandResponse{}, nil
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
		return
	}

	var user *model.User
	var err *model.AppError
	user, err = p.API.GetUser(userId)
	if err != nil {
		http.Error(w, err.Error(), err.StatusCode)
		return
	}

	if _, err = p.API.GetChannelMember(req.ChannelId, user.Id); err != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	if merr := p.startMeeting(user.Id, req.ChannelId, req.Topic); merr != nil {
		http.Error(w, "Internal error", http.StatusInternalServerError)
	}

	/*
		if err = p.API.KVSet(fmt.Sprintf("%v%v", POST_MEETING_KEY, meetingID), []byte(post.Id)); err != nil {
			http.Error(w, err.Error(), err.StatusCode)
			return
		}
	*/

	w.Write([]byte("OK"))
}

func (p *Plugin) handleJWTRequest(w http.ResponseWriter, r *http.Request) {
	if err := p.getConfiguration().IsValid(); err != nil {
		http.Error(w, err.Error(), http.StatusTeapot)
		return
	}

	userId := r.Header.Get("Mattermost-User-Id")

	if userId == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	var req GenerateMeetingJWTRequest

	if derr := json.NewDecoder(r.Body).Decode(&req); derr != nil {
		http.Error(w, derr.Error(), http.StatusBadRequest)
		return
	}

	var user *model.User
	var err *model.AppError
	user, err = p.API.GetUser(userId)
	if err != nil {
		http.Error(w, err.Error(), err.StatusCode)
	}

	if _, err = p.API.GetChannelMember(req.ChannelId, user.Id); err != nil {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var meetingID string
	meetingID = req.MeetingId
	if len(req.MeetingId) < 1 {
		http.Error(w, "Forbidden", http.StatusBadRequest)
		return
	}

	var displayName string
	displayName = req.DisplayName
	if len(req.DisplayName) < 1 {
		displayName += user.FirstName
		if len(displayName) > 0 && len(user.LastName) > 0 {
			displayName += " " + user.LastName
		}
		if len(displayName) > 0 && len(user.Nickname) > 0 {
			displayName += " (" + user.Nickname + ")"
		}
		if len(displayName) < 1 {
			displayName = user.Username
		}
	}

	var jwterr error
	var jwtResponse GenerateMeetingJWTResponse
	jwtResponse.MeetingLinkValidUntil, jwtResponse.Token, jwterr = p.generateJWTToken(meetingID, displayName)
	if jwterr != nil {
		http.Error(w, jwterr.Error(), http.StatusInternalServerError)
		return
	}

	tokenJson, jmerr := json.Marshal(jwtResponse)
	if jmerr != nil {
		http.Error(w, jmerr.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(tokenJson)
}
