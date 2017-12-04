const {connect} = window['react-redux'];
const {bindActionCreators} = window.redux;

import {displayUsernameForUser} from '../../utils/user_utils';

import PostTypeZoom from './post_type_zoom.jsx';

function mapStateToProps(state, ownProps) {
    const post = ownProps.post || {};
    const user = state.entities.users.profiles[post.user_id] || {};

    return {
        ...ownProps,
        creatorName: displayUsernameForUser(user, state.entities.general.config)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTypeZoom);
