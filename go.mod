module github.com/mattermost/mattermost-plugin-demo

go 1.12

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/dyatlov/go-opengraph v0.0.0-20180429202543-816b6608b3c8 // indirect
	github.com/golang/protobuf v1.3.1 // indirect
	github.com/google/uuid v1.1.1 // indirect
	github.com/gorilla/websocket v1.4.0 // indirect
	github.com/hashicorp/go-plugin v1.0.0 // indirect
	github.com/hashicorp/yamux v0.0.0-20181012175058-2f1d1f20f75d // indirect
	github.com/kr/pretty v0.1.0 // indirect
	github.com/mattermost/mattermost-server v5.9.0+incompatible
	github.com/mattermost/viper v1.0.4 // indirect
	github.com/mitchellh/go-testing-interface v1.0.0 // indirect
	github.com/nicksnyder/go-i18n v1.10.0 // indirect
	github.com/pborman/uuid v1.2.0 // indirect
	github.com/pelletier/go-toml v1.3.0 // indirect
	github.com/pkg/errors v0.8.1
	github.com/spf13/afero v1.2.2 // indirect
	github.com/spf13/jwalterweatherman v1.1.0 // indirect
	github.com/stretchr/testify v1.3.0
	go.uber.org/atomic v1.3.2 // indirect
	go.uber.org/multierr v1.1.0 // indirect
	go.uber.org/zap v1.9.1 // indirect
	golang.org/x/crypto v0.0.0-20190404164418-38d8ce5564a5 // indirect
	golang.org/x/net v0.0.0-20190404232315-eb5bcb51f2a3 // indirect
	golang.org/x/sys v0.0.0-20190405154228-4b34438f7a67 // indirect
	golang.org/x/text v0.3.1-0.20180807135948-17ff2d5776d2 // indirect
	google.golang.org/appengine v1.4.0 // indirect
	google.golang.org/genproto v0.0.0-20190404172233-64821d5d2107 // indirect
	google.golang.org/grpc v1.20.0 // indirect
	gopkg.in/check.v1 v1.0.0-20180628173108-788fd7840127 // indirect
	gopkg.in/natefinch/lumberjack.v2 v2.0.0 // indirect
)

// Workaround for https://github.com/golang/go/issues/30831 and fallout.
replace github.com/golang/lint => github.com/golang/lint v0.0.0-20190227174305-8f45f776aaf1
