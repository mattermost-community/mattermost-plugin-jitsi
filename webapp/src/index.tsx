// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as React from 'react';

import {Channel} from 'mattermost-redux/types/channels';
import {Post} from 'mattermost-redux/types/posts';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {GlobalState} from 'mattermost-redux/types/store';

import Icon from './components/icon';
import PostTypeJitsi from './components/post_type_jitsi';
import I18nProvider from './components/i18n_provider';
import RootPortal from './components/root_portal';
import reducer from './reducers';
import {startMeeting, loadConfig} from './actions';
import {id as pluginId} from './manifest';
import Client from './client';

class PluginClass {
    rootPortal?: RootPortal

    initialize(registry: any, store: any) {
        if ((window as any).JitsiMeetExternalAPI) {
            this.rootPortal = new RootPortal(registry, store);
            if (this.rootPortal) {
                this.rootPortal.render();
            }
        } else {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = () => {
                this.rootPortal = new RootPortal(registry, store);
                if (this.rootPortal) {
                    this.rootPortal.render();
                }
            };
            script.src = `${(window as any).basename}/plugins/${pluginId}/jitsi_meet_external_api.js`;
            document.head.appendChild(script);
        }
        registry.registerReducer(reducer);
        registry.registerChannelHeaderButtonAction(
            <Icon/>,
            (channel: Channel) => {
                store.dispatch(startMeeting(channel.id));
            },
            'Start Jitsi Meeting'
        );
        Client.setServerRoute(getServerRoute(store.getState()));
        registry.registerPostTypeComponent('custom_jitsi', (props: { post: Post }) => (
            <I18nProvider><PostTypeJitsi post={props.post}/></I18nProvider>));
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

function getServerRoute(state: GlobalState) {
    const config = getConfig(state);
    let basePath = '';
    if (config && config.SiteURL) {
        basePath = config.SiteURL;
        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }
    return basePath;
}
