# Mattermost Jitsi Plugin (Beta)

Start and join voice calls, video calls and use screen sharing with your team members with a Jitsi plugin for Mattermost.

Clicking a video icon in a Mattermost channel posts a message that invites team members to join a Jitsi meetings call.

Originally developed by [Sean Sackowitz](https://github.com/seansackowitz).

![image](https://user-images.githubusercontent.com/13119842/82223364-8e962900-98f0-11ea-9fdf-46327f111050.png)

## Installation

Go to the [releases page of this Github repository](https://github.com/seansackowitz/mattermost-plugin-jitsi/releases) and download the latest release for your server architecture. You can upload this file in the Mattermost system console to install the plugin.

### Manual build

You can use docker to compile the binaries yourself. Just run the provided `./docker-make` shell script which will build a docker image with necesarry build dependencies and runs `make all` afterwards.  
You can also use make targets like `dist` (`./docker-make dist`) from the [Makefile](./Makefile).

## Developing

This plugin contains both a server and web app portion.

Use `make` to check the quality of your code, as well as build distributions of the plugin that you can upload to a Mattermost server for testing.

### Server

Inside the `/server` directory, you will find the Go files that make up the server-side of the plugin. Within there, build the plugin like you would any other Go application.

### Web App

Inside the `/webapp` directory, you will find the JS and React files that make up the client-side of the plugin. Within there, modify files and components as necessary. Test your syntax by running `npm run build`.

## TODO

There is still a lot of work to do to separate this from the Zoom plugin, such as:
1. ~~Convert names from zoom to jitsi~~
2. Integrate with the Jitsi server for meeting status
3. Clean up a lot of unnecessary code
4. Add meeting topics back
