const React = window.react;
import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export default class PostTypeZoom extends React.PureComponent {
    static propTypes = {

        /*
         * The post to render the message for
         */
        post: PropTypes.object.isRequired,

        /**
         * Set to render post body compactly
         */
        compactDisplay: PropTypes.bool,

        /**
         * Flags if the post_message_view is for the RHS (Reply).
         */
        isRHS: PropTypes.bool,

        /*
         * Logged in user's theme
         */
        theme: PropTypes.object.isRequired,

        /*
         * Creator's name
         */
        creatorName: PropTypes.string.isRequired
    };

    static defaultProps = {
        mentionKeys: [],
        compactDisplay: false,
        isRHS: false
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const style = getStyle(this.props.theme);
        const post = this.props.post;
        const props = post.props || {};

        let preText;
        let content;
        let subtitle;
        if (props.meeting_status === 'STARTED') {
            preText = `${this.props.creatorName} has started a meeting`;
            content = (
                <a
                    className='btn btn-lg btn-primary'
                    style={style.button}
                    target='_blank'
                    href={'https://zoom.us/j/' + props.meeting_id}
                >
                    <i
                        className='fa fa-video-camera'
                        style={{paddingRight: '8px'}}
                    />
                    {'JOIN MEETING'}
                </a>
            );

            if (props.meeting_personal) {
                subtitle = (
                    <span>
                        {'Personal Meeting ID (PMI) : '}
                        <a
                            target='_blank'
                            href={'https://zoom.us/j/' + props.meeting_id}
                        >
                            {props.meeting_id}
                        </a>
                    </span>
                );
            } else {
                subtitle = (
                    <span>
                        {'Meeting ID : '}
                        <a
                            target='_blank'
                            href={'https://zoom.us/j/' + props.meeting_id}
                        >
                            {props.meeting_id}
                        </a>
                    </span>
                );
            }
        } else if (props.meeting_status === 'ENDED') {
            preText = `${this.props.creatorName} has ended the meeting`;

            if (props.meeting_personal) {
                subtitle = 'Personal Meeting ID (PMI) : ' + props.meeting_id;
            } else {
                subtitle = 'Meeting ID : ' + props.meeting_id;
            }
        }

        let title = 'Zoom Meeting';
        if (props.meeting_topic) {
            title = props.meeting_topic + ' Meeting';
        }

        return (
            <div>
                {preText}
                <div style={style.attachment}>
                    <div style={style.content}>
                        <div style={style.container}>
                            <h1 style={style.title}>
                                {title}
                            </h1>
                            {subtitle}
                            <div>
                                <div style={style.body}>
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        attachment: {
            marginLeft: '-20px',
            position: 'relative'
        },
        content: {
            borderRadius: '4px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#BDBDBF',
            margin: '5px 0 5px 20px',
            padding: '2px 5px'
        },
        container: {
            borderLeftStyle: 'solid',
            borderLeftWidth: '4px',
            padding: '10px',
            borderLeftColor: '#89AECB'
        },
        body: {
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingRight: '5px',
            width: '100%'
        },
        title: {
            fontSize: '16px',
            fontWeight: '600',
            height: '22px',
            lineHeight: '18px',
            margin: '5px 0 1px 0',
            padding: '0'
        },
        button: {
            fontFamily: 'Open Sans',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            lineHeight: '19px',
            marginTop: '12px',
            borderRadius: '4px'
        }
    };
});
