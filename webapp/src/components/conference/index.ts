import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {GenericAction} from 'mattermost-redux/types/actions';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';

import {GlobalState} from 'types';
import {openJitsiMeeting, setUserStatus} from '../../actions';
import Conference from './conference';

function mapStateToProps(state: GlobalState) {
    return {
        currentUserId: getCurrentUserId(state),
        post: state['plugins-jitsi'].openMeeting,
        jwt: state['plugins-jitsi'].openMeetingJwt
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
