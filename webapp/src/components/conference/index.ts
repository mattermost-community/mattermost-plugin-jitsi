import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {GenericAction} from 'mattermost-redux/types/actions';
import {General as MMConstants} from 'mattermost-redux/constants';
import {getCurrentChannelId, getCurrentUser} from 'mattermost-redux/selectors/entities/common';

import {GlobalState} from 'types';
import {openJitsiMeeting, setUserStatus, sendEphemeralPost} from '../../actions';
import Conference from './conference';

function mapStateToProps(state: GlobalState) {
    const pluginState = state['plugins-jitsi'];
    const config = pluginState.config;
    const currentUser = getCurrentUser(state);
    return {
        currentUserId: currentUser.id,
        isCurrentUserSysAdmin: currentUser.roles.includes(MMConstants.SYSTEM_ADMIN_ROLE),
        currentChannelId: getCurrentChannelId(state),
        post: pluginState.openMeeting,
        jwt: pluginState.openMeetingJwt,
        useJaas: Boolean(config.use_jaas)

    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            openJitsiMeeting,
            setUserStatus,
            sendEphemeralPost
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
