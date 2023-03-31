# Include custom targets and environment variables here



default: all

i18n-extract-server:
	@goi18n extract -format json -outdir assets/i18n/ server/
	@for x in assets/i18n/active.*.json; do echo $$x | sed 's/active/translate/' | sed 's/^/touch /' | bash; done
	@goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json
	@echo "Please update your assets/i18n/translate.*.json files and execute \"make i18n-merge-server\""
	@echo "If you don't want to change any locale file, simply remove the assets/i18n/translate.??.json file before calling \"make i18n-merge-server\""
	@echo "If you want to add a new language (for example french), simple run \"touch assets/i18n/active.fr.json\" and then run the \"make i18n-extract-server\" again"

i18n-merge-server:
	@goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json assets/i18n/translate.*.json
	@rm -f assets/i18n/translate.*.json
	@echo "Translations merged, please verify your "git diff" before you submit the changes"


# If there's no MM_RUDDER_PLUGINS_PROD, add DEV data
RUDDER_WRITE_KEY = 1d5bMvdrfWClLxgK1FvV3s4U1tg
ifdef MM_RUDDER_PLUGINS_PROD
	RUDDER_WRITE_KEY = $(MM_RUDDER_PLUGINS_PROD)
endif
GO_BUILD_FLAGS += -ldflags '-X "github.com/mattermost/mattermost-plugin-api/experimental/telemetry.rudderWriteKey=$(RUDDER_WRITE_KEY)"'
