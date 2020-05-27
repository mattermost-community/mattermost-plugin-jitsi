// main handles deployment of the plugin to a development server using either the Client4 API
// or by copying the plugin bundle into a sibling mattermost-server/plugin directory.
package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mholt/archiver/v3"
	"github.com/pkg/errors"
)

func main() {
	err := deploy()
	if err != nil {
		fmt.Printf("Failed to deploy: %s\n", err.Error())
		fmt.Println()
		fmt.Println("Usage:")
		fmt.Println("    deploy <plugin id> <bundle path>")
		os.Exit(1)
	}
}

// deploy handles deployment of the plugin to a development server.
func deploy() error {
	if len(os.Args) < 3 {
		return errors.New("invalid number of arguments")
	}

	pluginID := os.Args[1]
	bundlePath := os.Args[2]

	siteURL := os.Getenv("MM_SERVICESETTINGS_SITEURL")
	adminToken := os.Getenv("MM_ADMIN_TOKEN")
	adminUsername := os.Getenv("MM_ADMIN_USERNAME")
	adminPassword := os.Getenv("MM_ADMIN_PASSWORD")
	copyTargetDirectory, _ := filepath.Abs("../mattermost-server")

	if siteURL != "" {
		client := model.NewAPIv4Client(siteURL)

		if adminToken != "" {
			log.Printf("Authenticating using token against %s.", siteURL)
			client.SetToken(adminToken)

			return uploadPlugin(client, pluginID, bundlePath)
		}

		if adminUsername != "" && adminPassword != "" {
			client := model.NewAPIv4Client(siteURL)
			log.Printf("Authenticating as %s against %s.", adminUsername, siteURL)
			_, resp := client.Login(adminUsername, adminPassword)
			if resp.Error != nil {
				return errors.Wrapf(resp.Error, "failed to login as %s", adminUsername)
			}

			return uploadPlugin(client, pluginID, bundlePath)
		}
	}

	_, err := os.Stat(copyTargetDirectory)
	if os.IsNotExist(err) {
		return errors.New("no supported deployment method available, please install plugin manually")
	} else if err != nil {
		return errors.Wrapf(err, "failed to stat %s", copyTargetDirectory)
	}

	log.Printf("Installing plugin to mattermost-server found in %s.", copyTargetDirectory)
	log.Print("Server restart required to load updated plugin.")
	return copyPlugin(pluginID, copyTargetDirectory, bundlePath)
}

// uploadPlugin attempts to upload and enable a plugin via the Client4 API.
// It will fail if plugin uploads are disabled.
func uploadPlugin(client *model.Client4, pluginID, bundlePath string) error {
	pluginBundle, err := os.Open(bundlePath)
	if err != nil {
		return errors.Wrapf(err, "failed to open %s", bundlePath)
	}
	defer pluginBundle.Close()

	log.Print("Uploading plugin via API.")
	_, resp := client.UploadPluginForced(pluginBundle)
	if resp.Error != nil {
		return errors.Wrap(resp.Error, "failed to upload plugin bundle")
	}

	log.Print("Enabling plugin.")
	_, resp = client.EnablePlugin(pluginID)
	if resp.Error != nil {
		return errors.Wrap(resp.Error, "Failed to enable plugin")
	}

	return nil
}

// copyPlugin attempts to install a plugin by copying it to a sibling ../mattermost-server/plugin
// directory. A server restart is required before the plugin will start.
func copyPlugin(pluginID, targetPath, bundlePath string) error {
	targetPath = filepath.Join(targetPath, "plugins")

	err := os.MkdirAll(targetPath, 0777)
	if err != nil {
		return errors.Wrapf(err, "failed to create %s", targetPath)
	}

	existingPluginPath := filepath.Join(targetPath, pluginID)
	err = os.RemoveAll(existingPluginPath)
	if err != nil {
		return errors.Wrapf(err, "failed to remove existing existing plugin directory %s", existingPluginPath)
	}

	err = archiver.Unarchive(bundlePath, targetPath)
	if err != nil {
		return errors.Wrapf(err, "failed to unarchive %s into %s", bundlePath, targetPath)
	}

	return nil
}
