// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as React from 'react';

import {Channel} from 'mattermost-redux/types/channels';

import Icon from './components/icon';
import PostTypeJitsi from './components/post_type_jitsi';
import {startMeeting} from './actions';

class PluginClass {
    initialize(registry: any, store: any) {
        registry.registerChannelHeaderButtonAction(
            <Icon/>,
            (channel: Channel) => {
                startMeeting(channel.id)(store.dispatch, store.getState);
            },
            'Start Jitsi Meeting'
        );
        registry.registerPostTypeComponent('custom_jitsi', PostTypeJitsi);
    }
}

(global as any).window.registerPlugin('jitsi', new PluginClass());
