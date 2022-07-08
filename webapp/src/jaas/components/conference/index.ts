import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {startMeetingWindowActionCreator} from '../../actions';
import JaaSConference from './jaas_conference';

function mapDispatchToProps(dispatch: ThunkDispatch<any, any, AnyAction>) {
    return {
        actions: {
            startJaaSMeetingWindow: (param1: string | null, param2: string | null) => dispatch(startMeetingWindowActionCreator(param1, param2))
        }
    };
}

export default connect(null, mapDispatchToProps)(JaaSConference);
