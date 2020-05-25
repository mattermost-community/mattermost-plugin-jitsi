import {PostTypes} from 'mattermost-redux/action_types';

import Client from '../client';

export function startMeeting(channelId, personal = false, topic = '', meetingId = 0) {
    return async (dispatch, getState) => {
        try {
            await Client.startMeeting(channelId, personal, topic, meetingId);
        } catch (error) {
            const post = {
                id: 'jitsiPlugin' + Date.now(),
                create_at: Date.now(),
                update_at: 0,
                edit_at: 0,
                delete_at: 0,
                is_pinned: false,
                user_id: getState().entities.users.currentUserId,
                channel_id: channelId,
                root_id: '',
                parent_id: '',
                original_id: '',
                message: 'We could not start a meeting at this time.',
                type: 'system_ephemeral',
                props: {},
                hashtags: '',
                pending_post_id: ''
            };

            dispatch({
                type: PostTypes.RECEIVED_POSTS,
                data: {
                    order: [],
                    posts: {
                        [post.id]: post
                    }
                },
                channelId
            });

            return {error};
        }

        return {data: true};
    };
}

export function enrichMeetingJwt(meetingJwt) {
    return async (dispatch, getState) => {
        try {
            const data = await Client.enrichMeetingJwt(meetingJwt);
            return {data};
        } catch (error) {
            return {error};
        }
    };
}
