const {connect} = window['react-redux'];
const {bindActionCreators} = window.redux;

import PostTypeZoom from './post_type_zoom.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTypeZoom);
