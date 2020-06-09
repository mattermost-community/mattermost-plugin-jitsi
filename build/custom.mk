# Include custom targets and environment variables here

i18n-extract-server:
	goi18n extract -format json -outdir assets/i18n/ server/
	for x in assets/i18n/active.*.json; do echo $$x | sed 's/active/translate/' | sed 's/^/touch /' | bash; done
	goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json

i18n-merge-server:
	goi18n merge -format json -outdir assets/i18n/ assets/i18n/active.*.json assets/i18n/translate.*.json
	rm assets/i18n/translate.*.json

