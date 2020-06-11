import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {GenericAction} from 'mattermost-redux/types/actions';

import {GlobalState} from '../../types';
import Conference from './conference';
import {openJitsiMeeting} from '../../actions';

function mapStateToProps(state: GlobalState) {
    return {
        post: state['plugins-jitsi'].openMeeting,
        jwt: state['plugins-jitsi'].openMeetingJwt
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            openJitsiMeeting
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conference);
