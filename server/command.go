package main

import (
	"fmt"
	"strings"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const jitsiCommand = "meet"

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	input := strings.TrimSpace(strings.TrimPrefix(args.Command, "/"+jitsiCommand))

	if _, err := p.startMeeting(args.UserId, args.ChannelId, input, false); err != nil {
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
