// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import ActionTypes from '../action_types';

function config(state: object = {}, action: {type: string, data: object}) {
    switch (action.type) {
    case ActionTypes.CONFIG_RECEIVED:
        return action.data;
    default:
        return state;
    }
}

export default combineReducers({
    config
});
