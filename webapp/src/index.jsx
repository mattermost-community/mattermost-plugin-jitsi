// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import Icon from './components/icon.jsx';
import PostTypeJitsi from './components/post_type_jitsi';
import {startMeeting} from './actions';

class PluginClass {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            <Icon/>,
            (channel) => {
                startMeeting(channel.id)(store.dispatch, store.getState);
            },
            'Start Jitsi Meeting'
        );
        registry.registerPostTypeComponent('custom_jitsi', PostTypeJitsi);
    }
}

global.window.registerPlugin('jitsi', new PluginClass());
