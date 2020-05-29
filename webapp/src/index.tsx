// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as React from 'react';

import {Channel} from 'mattermost-redux/types/channels';

import Icon from './components/icon';
import PostTypeJitsi from './components/post_type_jitsi';
import RootPortal from './components/root_portal';
import reducer from './reducers';
import {startMeeting, loadConfig} from './actions';

class PluginClass {
    rootPortal: RootPortal | null = null

    initialize(registry: any, store: any) {
        if ((window as any).JitsiMeetExternalAPI) {
            this.rootPortal = new RootPortal(store);
            if (this.rootPortal) {
                this.rootPortal.render();
            }
        } else {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = () => {
                this.rootPortal = new RootPortal(store);
                if (this.rootPortal) {
                    this.rootPortal.render();
                }
            };
            script.src = (window as any).basename + '/plugins/jitsi/jitsi_meet_external_api.js';
            document.head.appendChild(script);
        }
        registry.registerReducer(reducer);
        registry.registerChannelHeaderButtonAction(
            <Icon/>,
            (channel: Channel) => {
                startMeeting(channel.id)(store.dispatch, store.getState);
            },
            'Start Jitsi Meeting'
        );
        registry.registerPostTypeComponent('custom_jitsi', PostTypeJitsi);
        registry.registerWebSocketEventHandler('custom_jitsi_config_update', () => store.dispatch(loadConfig()));
        store.dispatch(loadConfig());
    }

    uninitialize() {
        if (this.rootPortal) {
            this.rootPortal.cleanup();
        }
    }
}

(global as any).window.registerPlugin('jitsi', new PluginClass());
