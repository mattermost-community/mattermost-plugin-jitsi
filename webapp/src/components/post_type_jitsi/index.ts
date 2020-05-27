import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {getBool, getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {GlobalState} from 'mattermost-redux/types/store';
import {GenericAction} from 'mattermost-redux/types/actions';

import {Post} from 'mattermost-redux/types/posts';

import {displayUsernameForUser} from '../../utils/user_utils';
import {enrichMeetingJwt} from '../../actions';

import {PostTypeJitsi} from './post_type_jitsi';

type OwnProps = {
    post: Post,
}

function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
    const post = ownProps.post;
    const user = state.entities.users.profiles[post.user_id];

    return {
        ...ownProps,
        theme: getTheme(state),
        creatorName: displayUsernameForUser(user, state.entities.general.config),
        useMilitaryTime: getBool(state, 'display_settings', 'use_military_time', false)
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            enrichMeetingJwt
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTypeJitsi);
