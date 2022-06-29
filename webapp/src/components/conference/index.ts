import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {GenericAction} from 'mattermost-redux/types/actions';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {GlobalState} from '../../types';
import Conference from './conference';
import {openJitsiMeeting, setUserStatus} from '../../actions';

function mapStateToProps(state: GlobalState) {
    const config = state['plugins-jitsi'].config;

    return {
        currentUserId: getCurrentUserId(state),
        post: state['plugins-jitsi'].openMeeting,
        jwt: state['plugins-jitsi'].openMeetingJwt,
        showPrejoinPage: Boolean(config.show_prejoin_page),
        meetingEmbedded: Boolean(config.embedded)
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            openJitsiMeeting,
            setUserStatus
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
