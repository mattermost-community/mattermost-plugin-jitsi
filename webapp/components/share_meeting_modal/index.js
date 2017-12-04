const {connect} = window['react-redux'];
const {bindActionCreators} = window.redux;

import {startMeeting} from '../../actions';

import ShareMeetingModal from './share_meeting_modal.jsx';

function mapStateToProps(state, ownProps) {
    return ownProps;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            startMeeting
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareMeetingModal);
