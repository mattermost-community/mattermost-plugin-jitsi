.PHONY: build test run clean stop check-style gofmt

check-style: .npminstall gofmt
	@echo Checking for style guide compliance

	cd webapp && npm run check

gofmt:
	@echo Running GOFMT

	@for package in $$(go list ./server/...); do \
		echo "Checking "$$package; \
		files=$$(go list -f '{{range .GoFiles}}{{$$.Dir}}/{{.}} {{end}}' $$package); \
		if [ "$$files" ]; then \
			gofmt_output=$$(gofmt -d -s $$files 2>&1); \
			if [ "$$gofmt_output" ]; then \
				echo "$$gofmt_output"; \
				echo "gofmt failure"; \
				exit 1; \
			fi; \
		fi; \
	done
	@echo "gofmt success"; \

test: .npminstall
	@echo Not yet implemented

webapp/.npminstall:
	@echo Getting dependencies using npm

	cd webapp && npm install
	touch $@

vendor: server/glide.lock
	cd server && go get github.com/Masterminds/glide
	cd server && $(shell go env GOPATH)/bin/glide install

dist: webapp/.npminstall vendor plugin.json
	@echo Building plugin

	# Clean old dist
	rm -rf dist
	rm -rf webapp/dist
	rm -f server/plugin.exe

	# Build and copy files from webapp
	cd webapp && npm run build
	mkdir -p dist/zoom/webapp
	cp webapp/dist/* dist/zoom/webapp/

	# Build files from server
	cd server && go get github.com/mitchellh/gox
	$(shell go env GOPATH)/bin/gox -osarch='darwin/amd64 linux/amd64 windows/amd64' -output 'dist/intermediate/plugin_{{.OS}}_{{.Arch}}' ./server

	# Copy plugin files
	cp plugin.json dist/zoom/

	# Copy server executables & compress plugin
	mkdir -p dist/zoom/server
	mv dist/intermediate/plugin_darwin_amd64 dist/zoom/server/plugin.exe
	cd dist && tar -zcvf mattermost-zoom-plugin-darwin-amd64.tar.gz zoom/*
	mv dist/intermediate/plugin_linux_amd64 dist/zoom/server/plugin.exe
	cd dist && tar -zcvf mattermost-zoom-plugin-linux-amd64.tar.gz zoom/*
	mv dist/intermediate/plugin_windows_amd64.exe dist/zoom/server/plugin.exe
	cd dist && tar -zcvf mattermost-zoom-plugin-windows-amd64.tar.gz zoom/*

	# Clean up temp files
	rm -rf dist/zoom
	rm -rf dist/intermediate

	@echo MacOS X plugin built at: dist/mattermost-zoom-plugin-darwin-amd64.tar.gz
	@echo Linux plugin built at: dist/mattermost-zoom-plugin-linux-amd64.tar.gz
	@echo Windows plugin built at: dist/mattermost-zoom-plugin-windows-amd64.tar.gz

run: .npminstall
	@echo Not yet implemented

stop:
	@echo Not yet implemented

clean:
	@echo Cleaning plugin

	rm -rf dist
	rm -rf webapp/dist
	rm -rf webapp/node_modules
	rm -rf webapp/.npminstall
	rm -f server/plugin.exe
