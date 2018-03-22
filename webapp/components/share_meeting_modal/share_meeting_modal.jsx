const React = window.react;
const {Modal} = window['react-bootstrap'];

import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

const ZOOM_MEETING_ID_LENGTH = [9, 10, 11];

export default class ShareMeetingModal extends React.PureComponent {
    static propTypes = {
        /*
         * Set to true to show modal
         */
        show: PropTypes.bool.isRequired,

        /*
         * Set to true to show share options
         */
        share: PropTypes.bool.isRequired,

        /*
         * Current channel ID
         */
        channelId: PropTypes.string.isRequired,

        /*
         * Logged in user's theme
         */
        theme: PropTypes.object.isRequired,

        /*
         * Function to hide the modal
         */
        hide: PropTypes.func.isRequired,

        actions: PropTypes.shape({

            /*
             * Action to start a meeting
             */
            startMeeting: PropTypes.func.isRequired
        }).isRequired
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show && !this.props.show) {
            this.setState({
                topic: '',
                meetingId: '',
                meetingIdError: null
            });
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            topic: '',
            meetingId: '',
            meetingIdError: null
        };
    }

    onTopicChange = (e) => {
        this.setState({topic: e.target.value});
    }

    onMeetingIdChange = (e) => {
        this.setState({meetingId: e.target.value});
    }

    startMeeting = async () => {
        const meetingId = this.state.meetingId.trim().replace(/-/g, '');
        if (this.props.share && !ZOOM_MEETING_ID_LENGTH.includes(meetingId.length)) {
            this.setState({meetingIdError: 'Meeting ID must be a 9, 10 or 11-digit number'});
            return;
        }

        this.setState({meetingIdError: null});

        await this.props.actions.startMeeting(this.props.channelId, !this.props.share, this.state.topic, parseInt(meetingId, 10));
        this.props.hide();
    }

    onHide = () => {
        this.setState({
            topic: '',
            meetingId: '',
            meetingIdError: null
        });

        this.props.hide();
    }

    render() {
        const style = getStyle(this.props.theme);

        let title = 'Start Jitsi Meeting';
        let button = 'Start Meeting';
        let meetingIdInput;
        if (this.props.share) {
            title = 'Share Jitsi Meeting';
            button = 'Share Meeting';

            let error;
            if (this.state.meetingIdError) {
                error = (
                    <label
                        className='control-label'
                        style={style.error}
                    >
                        {this.state.meetingIdError}
                    </label>
                );
            }

            meetingIdInput = (
                <div style={style.meetingId}>
                    <label
                        className='control-label col-sm-3'
                        style={style.label}
                    >
                        {'Meeting ID'}
                    </label>
                    <div className='col-sm-9'>
                        <input
                            onChange={this.onMeetingIdChange}
                            type='text'
                            className='form-control'
                            placeholder='E.g.: “314-257-8967”'
                            value={this.state.meetingId}
                            maxLength={100}
                        />
                        {error}
                    </div>
                </div>
            );
        }

        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
            >
                <form onSubmit={(e) => e.preventDefault()}>
                    <Modal.Header closeButton={true}>
                        <h4 style={style.title}>{title}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <label
                                className='control-label col-sm-3'
                                style={style.label}
                            >
                                {'Topic '}<i style={{fontWeight: 'normal'}}>{'(optional)'}</i>
                            </label>
                            <div className='col-sm-9'>
                                <input
                                    onChange={this.onTopicChange}
                                    autoFocus={true}
                                    type='text'
                                    className='form-control'
                                    placeholder='E.g.: “One on one”, “Marketing”, “会议室”'
                                    value={this.state.topic}
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        {meetingIdInput}
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type='button'
                            className='btn btn-default'
                            onClick={this.props.hide}
                        >
                            {'Cancel'}
                        </button>
                        <button
                            type='submit'
                            className='btn btn-primary'
                            onClick={this.startMeeting}
                        >
                            {button}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        title: {
            margin: '5px 0 0 0',
            fontSize: '17px'
        },
        label: {
            top: '6px'
        },
        error: {
            color: '#811519',
            marginTop: '10px',
            fontFamily: 'Open Sans',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '19px'
        },
        meetingId: {
            marginTop: '55px'
        }
    };
});
