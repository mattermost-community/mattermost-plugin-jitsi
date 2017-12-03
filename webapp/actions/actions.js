import {Client4} from 'mattermost-redux/client';
import {UserTypes} from 'mattermost-redux/action_types';

/* If you need actions that are not available in mattermost-redux, add them here.
    This is a simplified version of the getUser() action available in mattermost-redux
    re-implemented here as an example. Actions should always be async and return a
    {data, error} object */
export function getUser(userId) {
    return async (dispatch, getState) => {
        let user;
        try {
            user = await Client4.getUser(userId);
        } catch (error) {
            return {data: null, error};
        }

        /* Dispatches are only needed if you want to update the redux store */
        dispatch({
            type: UserTypes.RECEIVED_USER,
            data: user
        });

        return {data: user, error: null};
    };
}
