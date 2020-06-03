package main

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/pkg/errors"
	"golang.org/x/text/language"
)

// initI18nBundle loads all localization files in i18n into a bundle and return this
func (p *Plugin) initI18nBundle() (*i18n.Bundle, error) {
	bundle := i18n.NewBundle(language.English)
	bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

	bundlePath, err := p.API.GetBundlePath()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get bundle path")
	}

	i18nDir := filepath.Join(bundlePath, "assets", "i18n")
	files, err := ioutil.ReadDir(i18nDir)
	if err != nil {
		return nil, errors.Wrap(err, "failed to open i18n directory")
	}

	for _, file := range files {
		if file.Name() == "en.json" {
			continue
		}
		_, err = bundle.LoadMessageFile(filepath.Join(i18nDir, file.Name()))
		if err != nil {
			return nil, errors.Wrapf(err, "failed to load message file %s", file.Name())
		}
	}

	return bundle, nil
}

// getUserLocalizer returns a localizer that localizes in the users locale
func (p *Plugin) getUserLocalizer(userID string) *i18n.Localizer {
	user, err := p.API.GetUser(userID)
	if err != nil {
		p.API.LogWarn("Failed get user's locale", "error", err.Error())
		return p.getServerLocalizer()
	}

	return i18n.NewLocalizer(p.i18nBundle, user.Locale)
}

// getServerLocalizer returns a localizer that localizes in the default server locale
func (p *Plugin) getServerLocalizer() *i18n.Localizer {
	return i18n.NewLocalizer(p.i18nBundle, *p.API.GetConfig().LocalizationSettings.DefaultServerLocale)
}
