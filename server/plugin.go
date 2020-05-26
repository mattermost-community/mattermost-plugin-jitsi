package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/cristalhq/jwt/v2"
	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
	"github.com/pkg/errors"
)

const (
	PostMeetingKey = "post_meeting_"
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

	if err := p.API.RegisterCommand(&model.Command{
		Trigger:          jitsiCommand,
		AutoComplete:     true,
		AutoCompleteDesc: "Start a Jitsi meeting for the current channel. Optionally, append desired meeting topic after the command",
	}); err != nil {
		return err
	}

	return nil
}

type User struct {
	Avatar string `json:"avatar"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	ID     string `json:"id"`
}

type Context struct {
	User  User   `json:"user"`
	Group string `json:"group"`
}

type EnrichMeetingJwtRequest struct {
	Jwt string `json:"jwt"`
}

// Claims extents cristalhq/jwt standard claims to add jitsi-web-token specific fields
type Claims struct {
	jwt.StandardClaims
	Context Context `json:"context"`
	Room    string  `json:"room,omitempty"`
}

func verifyJwt(secret string, jwtToken string) (*Claims, error) {
	verifier, err := jwt.NewVerifierHS(jwt.HS256, []byte(secret))
	if err != nil {
		log.Printf("Error generating new HS256 signer: %v", err)
		return nil, err
	}

	newToken, err := jwt.ParseAndVerifyString(jwtToken, verifier)
	if err != nil {
		log.Printf("Error parsing or verifiying jwt: %v", err)
		return nil, err
	}

	var claims Claims
	if err = json.Unmarshal(newToken.RawClaims(), &claims); err != nil {
		log.Printf("Error unmarshalling claims from jwt: %v", err)
		return nil, err
	}
	return &claims, nil
}

func signClaims(secret string, claims *Claims) (string, error) {
	signer, err2 := jwt.NewSignerHS(jwt.HS256, []byte(secret))
	if err2 != nil {
		log.Printf("Error generating new HS256 signer: %v", err2)
		return "", errors.New("internal error")
	}
	builder := jwt.NewBuilder(signer)
	token, err := builder.Build(claims)
	if err != nil {
		return "", err
	}
	return string(token.Raw()), nil
}

func (p *Plugin) updateJwtUserInfo(jwtToken string, user *model.User) (string, error) {
	secret := p.getConfiguration().JitsiAppSecret

	claims, err := verifyJwt(secret, jwtToken)
	if err != nil {
		return "", err
	}

	config := p.API.GetConfig()
	if config.PrivacySettings.ShowFullName == nil || !*config.PrivacySettings.ShowFullName {
		user.FirstName = ""
		user.LastName = ""
	}
	if config.PrivacySettings.ShowEmailAddress == nil || !*config.PrivacySettings.ShowEmailAddress {
		user.Email = ""
	}
	newContext := Context{
		User: User{
			Avatar: fmt.Sprintf("%s/api/v4/users/%s/image?_=%d", *config.ServiceSettings.SiteURL, user.Id, user.LastPictureUpdate),
			Name:   user.GetDisplayName(model.SHOW_NICKNAME_FULLNAME),
			Email:  user.Email,
			ID:     user.Id,
		},
		Group: claims.Context.Group,
	}

	claims.Context = newContext

	return signClaims(secret, claims)
}

func (p *Plugin) startMeeting(user *model.User, channel *model.Channel, meetingTopic string, personal bool) (string, error) {
	meetingID := encodeJitsiMeetingID(meetingTopic)
	meetingPersonal := false

	if len(meetingTopic) < 1 {
		namingScheme := p.getConfiguration().JitsiNamingScheme

		switch namingScheme {
		case "english-titlecase":
			meetingID = generateEnglishTitleName()
		case "uuid":
			meetingID = generateUUIDName()
		case "mattermost":
			if channel.Type == model.CHANNEL_DIRECT || channel.Type == model.CHANNEL_GROUP {
				meetingID = generatePersonalMeetingName(user.Username, user.Id)
				meetingTopic = fmt.Sprintf("%s's Personal Meeting", user.GetDisplayName(model.SHOW_NICKNAME_FULLNAME))
				meetingPersonal = true
			} else {
				team, teamErr := p.API.GetTeam(channel.TeamId)
				if teamErr != nil {
					return "", teamErr
				}
				meetingTopic = fmt.Sprintf("%s Channel Meeting", channel.DisplayName)
				meetingID = generateTeamChannelName(team.Name, channel.Name)
			}
		default:
			meetingID = generateEnglishTitleName()
		}
	}
	jitsiURL := strings.TrimSpace(p.getConfiguration().JitsiURL)
	jitsiURL = strings.TrimRight(jitsiURL, "/")
	meetingURL := jitsiURL + "/" + meetingID
	meetingLink := meetingURL

	var meetingLinkValidUntil = time.Time{}
	JWTMeeting := p.getConfiguration().JitsiJWT
	var jwtToken string

	if JWTMeeting {
		// Error check is done in configuration.IsValid()
		jURL, _ := url.Parse(p.getConfiguration().JitsiURL)

		meetingLinkValidUntil = time.Now().Add(time.Duration(p.getConfiguration().JitsiLinkValidTime) * time.Minute)

		claims := Claims{}
		claims.Issuer = p.getConfiguration().JitsiAppID
		claims.Audience = []string{p.getConfiguration().JitsiAppID}
		claims.ExpiresAt = jwt.NewNumericDate(meetingLinkValidUntil)
		claims.Subject = jURL.Hostname()
		claims.Room = meetingID

		var err2 error
		jwtToken, err2 = signClaims(p.getConfiguration().JitsiAppSecret, &claims)
		if err2 != nil {
			return "", err2
		}

		meetingURL = meetingURL + "?jwt=" + jwtToken
	}

	meetingUntil := ""
	if JWTMeeting {
		meetingUntil = "Meeting link valid until: " + meetingLinkValidUntil.Format("Mon Jan 2 15:04:05 -0700 MST 2006")
	}

	meetingTypeString := "Meeting ID"
	if meetingPersonal {
		meetingTypeString = "Personal Meeting ID (PMI)"
	}

	slackAttachment := model.SlackAttachment{
		Fallback:  fmt.Sprintf("Video Meeting started at [%s](%s).\n\n[Join Meeting](%s)\n\n%s", meetingID, meetingURL, meetingURL, meetingUntil),
		Title:     meetingTopic,
		TitleLink: meetingURL,
		Text:      fmt.Sprintf("%s: [%s](%s)\n\n[:movie_camera:  Join Meeting](%s)\n\n%s", meetingTypeString, meetingID, meetingURL, meetingURL, meetingUntil),
	}

	post := &model.Post{
		UserId:    user.Id,
		ChannelId: channel.Id,
		Type:      "custom_jitsi",
		Props: map[string]interface{}{
			"attachments":             []*model.SlackAttachment{&slackAttachment},
			"meeting_id":              meetingID,
			"meeting_link":            meetingLink,
			"jwt_meeting":             JWTMeeting,
			"meeting_jwt":             jwtToken,
			"jwt_meeting_valid_until": meetingLinkValidUntil.Unix(),
			"meeting_personal":        meetingPersonal,
			"meeting_topic":           meetingTopic,
			"from_webhook":            "true",
			"override_username":       "Jitsi",
			"override_icon_url":       "https://s3.amazonaws.com/mattermost-plugin-media/Zoom+App.png",
		},
	}

	if _, err := p.API.CreatePost(post); err != nil {
		return "", err
	}

	err := p.API.KVSet(fmt.Sprintf("%v%v", PostMeetingKey, meetingID), []byte(post.Id))
	if err != nil {
		return "", err
	}

	return meetingID, nil
}

// MarshalBinary default marshaling to JSON.
func (c Claims) MarshalBinary() (data []byte, err error) {
	return json.Marshal(c)
}

func encodeJitsiMeetingID(meeting string) string {
	reg := regexp.MustCompile("[^a-zA-Z0-9]+")
	return reg.ReplaceAllString(meeting, "")
}
