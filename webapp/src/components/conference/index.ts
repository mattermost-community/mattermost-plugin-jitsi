import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {GenericAction} from 'mattermost-redux/types/actions';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';

import {GlobalState, plugin} from 'types';
import {openJitsiMeeting, setUserStatus} from 'actions';
import {id as pluginId} from 'manifest';
import Conference from './conference';

function mapStateToProps(state: GlobalState) {
    const config = state[`plugins-${pluginId}` as plugin].config;

    return {
        currentUserId: getCurrentUserId(state),
        post: state[`plugins-${pluginId}` as plugin].openMeeting,
        jwt: state[`plugins-${pluginId}` as plugin].openMeetingJwt,
        showPrejoinPage: config.show_prejoin_page,
        meetingEmbedded: config.embedded
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
