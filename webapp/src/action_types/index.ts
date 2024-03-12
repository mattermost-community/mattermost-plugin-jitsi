// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from '../manifest';

const {id: pluginId} = manifest;

export default {
    OPEN_MEETING: pluginId + '_open_meeting',
    CONFIG_RECEIVED: pluginId + '_config_received',
    USER_STATUS_CHANGED: pluginId + '_user_status_changed'
};
