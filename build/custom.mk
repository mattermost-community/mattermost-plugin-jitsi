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

