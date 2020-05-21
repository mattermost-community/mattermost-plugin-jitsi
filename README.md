# Mattermost Jitsi Plugin (Beta)

Start and join voice calls, video calls and use screen sharing with your team members with a Jitsi plugin for Mattermost.

Clicking a video icon in a Mattermost channel posts a message that invites team members to join a Jitsi meetings call.

Originally developed by [Sean Sackowitz](https://github.com/seansackowitz).

![image](https://user-images.githubusercontent.com/13119842/82381170-ba500680-99f7-11ea-8254-d4503999783e.png)

## Features

- Use a `/jitsi` command to start a new meeting. Optionally append a desired meeting topic after the command.
- Click a video icon in channel header to start a new Jitsi meeting in the channel. Not yet supported on mobile.

## Installation

1. Go to https://github.com/mattermost/mattermost-plugin-jitsi/releases to download the latest release file in tar.gz format.
2. Upload the file through **System Console > Plugins > Management**, or manually upload it to the Mattermost server under plugin directory. See [documentation](https://docs.mattermost.com/administration/plugins.html#set-up-guide) for more details.

## Configuration

Go to **System Console > Plugins > Jitsi** and set the following values:

1. **Enable Plugin**: ``true``
2. **Jitsi URL**: The URL for your on-premise Jitsi server. If you set the Jitsi Server URL to https://meet.jit.si it uses the public server provided by Jitsi.
3. (Optional) If your Jitsi server uses JSON Web Tokens (JWT) for authentication, set **Use JWT Authentication for Jitsi** to true, and specify the App ID and App Secret used for JWT authentication.
4. (Optional) **Meeting Link Expiry Time** in minutes. Defaults to 30 minutes.
5. (Optional) **Meeting Naming Scheme** for auto-generated Jitsi meeting links. Defaults to generating a UUID as the meeting link, but you can also define it as the team and channel name where the Jitsi meeting is created.

You're all set! To test it, go to any Mattermost channel and click the video icon in the channel header to start a new Jitsi meeting.

### Manual Builds

You can use Docker to compile the binaries yourself. Run `./docker-make` shell script which builds a Docker image with necessary build dependencies and runs `make all` afterwards.

You can also use make targets like `dist` (`./docker-make dist`) from the [Makefile](./Makefile).

## Developing

This plugin contains both a server and web app portion.

Use `make` to check the quality of your code, as well as build distributions of the plugin that you can upload to a Mattermost server for testing.

### Server

Inside the `/server` directory, you will find the Go files that make up the server-side of the plugin. Within there, build the plugin like you would any other Go application.

### Web App

Inside the `/webapp` directory, you will find the JS and React files that make up the client-side of the plugin. Within there, modify files and components as necessary. Test your syntax by running `npm run build`.
