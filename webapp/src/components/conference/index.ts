import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';
import {GenericAction} from 'mattermost-redux/types/actions';
import {getCurrentUserLocale} from 'mattermost-redux/selectors/entities/i18n';

import {id as pluginId} from '../../manifest';
import Conference from './conference';
import {openJitsiMeeting} from '../../actions';

function mapStateToProps(state: GlobalState) {
    return {
        post: (state as any)[`plugins-${pluginId}`].openMeeting,
        jwt: (state as any)[`plugins-${pluginId}`].openMeetingJwt,
        currentLocale: getCurrentUserLocale(state)
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
