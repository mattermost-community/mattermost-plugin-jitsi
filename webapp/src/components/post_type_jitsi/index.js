import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getBool} from 'mattermost-redux/selectors/entities/preferences';
import {displayUsernameForUser} from '../../utils/user_utils';
import {enrichMeetingJwt} from '../../actions';

import PostTypeJitsi from './post_type_jitsi.jsx';

function mapStateToProps(state, ownProps) {
    const post = ownProps.post || {};
    const user = state.entities.users.profiles[post.user_id] || {};

    return {
        ...ownProps,
        creatorName: displayUsernameForUser(user, state.entities.general.config),
        useMilitaryTime: getBool(state, 'display_settings', 'use_military_time', false)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            enrichMeetingJwt
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTypeJitsi);
