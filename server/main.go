package main

import (
	"github.com/mattermost/mattermost-server/plugin/rpcplugin"
)

func main() {
	rpcplugin.Main(&Plugin{})
}
