import {combineReducers, AnyAction, Reducer} from 'redux';
import {StartMeetingWindowAction} from '../actions';
import {JaaSMeetingState, JaaSState} from '../util';
import ActionTypes from '../action_types';

type JaaSActions = StartMeetingWindowAction | AnyAction;

function JaaSMeetingWindow(state: JaaSMeetingState = {}, action: JaaSActions) {
    switch (action.type) {
    case ActionTypes.START_MEETING_WINDOW: {
        return {
            jaasJwt: action.data.jaasJwt,
            jaasRoom: action.data.jaasRoom
        };
    }
    default:
        break;
    }
    return state;
}

export const JaaSMeetingWindowReducer: Reducer<JaaSMeetingState> = JaaSMeetingWindow;

export default combineReducers<JaaSState>({
    jaasMeetingState: JaaSMeetingWindowReducer
});
