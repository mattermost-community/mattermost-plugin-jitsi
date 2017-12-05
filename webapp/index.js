// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import ChannelHeaderButton from './components/channel_header_button';
import MobileChannelHeaderButton from './components/mobile_channel_header_button';
import PostTypeZoom from './components/post_type_zoom';

class PluginClass {
    initialize(registerComponents, store) {
        registerComponents({ChannelHeaderButton, MobileChannelHeaderButton}, {custom_zoom: PostTypeZoom});
    }
}

global.window.plugins['zoom'] = new PluginClass();
