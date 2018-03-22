const React = window.react;

import ShareMeetingModal from '../share_meeting_modal';

import {Svgs} from '../../constants';

import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

const MIN_SCREEN_WIDTH = 480;

export default class MobileChannelHeaderButton extends React.PureComponent {
    static propTypes = {
        /*
         * The current channel ID
         */
        channelId: PropTypes.string.isRequired,

        /*
         * Logged in user's theme
         */
        theme: PropTypes.object.isRequired,

        actions: PropTypes.shape({

            /*
             * Action to start a meeting
             */
            startMeeting: PropTypes.func.isRequired
        }).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            shareModal: false
        };
    }

    showModal = () => {
        this.setState({showModal: true, shareModal: false});
    }

    showModalAsShare = () => {
        this.setState({showModal: true, shareModal: true});
    }

    hideModal = () => {
        this.setState({showModal: false});
    }

    startMeeting = async () => {
        await this.props.actions.startMeeting(this.props.channelId, true, this.state.topic);
    }

    render() {
        if (this.props.channelId === '' || window.innerWidth <= MIN_SCREEN_WIDTH) {
            return <div/>;
        }

        const style = getStyle(this.props.theme);

        // TODO: convert CSS classes to style objects to remove reliance on webapp
        return (
            <div className='navbar-toggle navbar-right__icon navbar-search pull-right'>
                <div className='navbar-brand'>
                    <div className='dropdown'>
                        <a
                            href='#'
                            className='dropdown-toggle theme'
                            style={style.icon}
                            type='button'
                            data-toggle='dropdown'
                            aria-expanded='true'
                        >
                            <span
                                className='icon icon__search'
                                dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA}}
                                aria-hidden='true'
                            />
                        </a>
                        <ul
                            className='dropdown-menu'
                            role='menu'
                        >
                            <li role='presentation'>
                                <a
                                    role='menuitem'
                                    href='#'
                                    onClick={this.startMeeting}
                                >
                                    {'Start Jitsi Meeting Now'}
                                </a>
                            </li>
                            <li role='presentation'>
                                <a
                                    role='menuitem'
                                    href='#'
                                    onClick={this.showModal}
                                >
                                    {'Start Jitsi Meeting with Topic'}
                                </a>
                            </li>
                            <li role='presentation'>
                                <a
                                    role='menuitem'
                                    href='#'
                                    onClick={this.showModalAsShare}
                                >
                                    {'Share Jitsi Meeting'}
                                </a>
                            </li>
                            <div
                                className='close visible-xs-block'
                            >
                                {'×'}
                            </div>
                        </ul>
                    </div>
                </div>
                <ShareMeetingModal
                    show={this.state.showModal}
                    channelId={this.props.channelId}
                    theme={this.props.theme}
                    hide={this.hideModal}
                    share={this.state.shareModal}
                />
            </div>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        icon: {
            position: 'relative',
            top: '-9px',
            left: '1px',
            fill: theme.buttonBg
        }
    };
});
