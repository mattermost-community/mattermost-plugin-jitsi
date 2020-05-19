package main

import (
	"fmt"
	"strings"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const jitsiCommand = "jitsi"

func commandError(channelId string, detailedError string) (*model.CommandResponse, *model.AppError) {
	return &model.CommandResponse{
			ResponseType: model.COMMAND_RESPONSE_TYPE_EPHEMERAL,
			ChannelId:    channelId,
			Text:         "We could not start a meeting at this time.",
		}, &model.AppError{
			Message:       "We could not start a meeting at this time.",
			DetailedError: detailedError,
		}
}

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	input := strings.TrimSpace(strings.TrimPrefix(args.Command, "/"+jitsiCommand))

	user, appErr := p.API.GetUser(args.UserId)
	if appErr != nil {
		return commandError(args.ChannelId, fmt.Sprintf("getUser() threw error: %s", appErr))
	}

	channel, appErr := p.API.GetChannel(args.ChannelId)
	if appErr != nil {
		return commandError(args.ChannelId, fmt.Sprintf("getChannel() threw error: %s", appErr))
	}

	if _, err := p.startMeeting(user, channel, input, false); err != nil {
		return commandError(args.ChannelId, fmt.Sprintf("startMeeting() threw error: %s", appErr))
	}

	return &model.CommandResponse{}, nil
}
