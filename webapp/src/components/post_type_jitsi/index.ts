import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';

import {getBool, getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {GenericAction, ActionFunc, ActionResult} from 'mattermost-redux/types/actions';

import {Post} from 'mattermost-redux/types/posts';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {GlobalState} from '../../types';
import {displayUsernameForUser} from '../../utils/user_utils';
import {enrichMeetingJwt, openJitsiMeeting, setUserStatus} from '../../actions';
import {PostTypeJitsi} from './post_type_jitsi';

type OwnProps = {
    post: Post,
}

function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
    const post = ownProps.post;
    const user = state.entities.users.profiles[post.user_id];
    const config = state['plugins-jitsi'].config;

    return {
        ...ownProps,
        currentUserId: getCurrentUserId(state),
        theme: getTheme(state),
        creatorName: displayUsernameForUser(user, state.entities.general.config),
        useMilitaryTime: getBool(state, 'display_settings', 'use_military_time', false),
        meetingEmbedded: Boolean(config.embedded)
    };
}

type Actions = {
    enrichMeetingJwt: (jwt: string) => Promise<ActionResult>,
    openJitsiMeeting: (post: Post | null, jwt: string | null) => ActionResult,
    setUserStatus: (userId: string, status: string) => Promise<ActionResult>,
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            enrichMeetingJwt,
            openJitsiMeeting,
            setUserStatus
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTypeJitsi);
