const {connect} = window['react-redux'];
const {bindActionCreators} = window.redux;

import {startMeeting} from '../../actions';

import ChannelHeaderButton from './channel_header_button.jsx';

function mapStateToProps(state, ownProps) {
    let channelId = state.entities.channels.currentChannelId;
    const channel = state.entities.channels.channels[channelId] || {};
    const userId = state.entities.users.currentUserId;
    if (channel.name === `${userId}__${userId}`) {
        channelId = '';
    }

    return {
        channelId,
        ...ownProps
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            startMeeting
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelHeaderButton);
