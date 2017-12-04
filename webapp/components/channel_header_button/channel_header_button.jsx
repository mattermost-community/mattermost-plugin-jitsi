const React = window.react;
const {Overlay, OverlayTrigger, Popover, Tooltip} = window['react-bootstrap'];

import ShareMeetingModal from '../share_meeting_modal';

import PropTypes from 'prop-types';
import {makeStyleFromTheme, changeOpacity} from 'mattermost-redux/utils/theme_utils';

export default class ChannelHeaderButton extends React.PureComponent {
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
            showPopover: false,
            hover: false,
            rowStartHover: false,
            rowStartWithTopicHover: false,
            rowShareHover: false,
            showModal: false,
            shareModal: false
        };
    }

    showHover = () => {
        this.setState({hover: true});
    }

    hideHover = () => {
        this.setState({hover: false});
    }

    rowStartShowHover = () => {
        this.setState({rowStartHover: true});
    }

    rowStartHideHover = () => {
        this.setState({rowStartHover: false});
    }

    rowStartWithTopicShowHover = () => {
        this.setState({rowStartWithTopicHover: true});
    }

    rowStartWithTopicHideHover = () => {
        this.setState({rowStartWithTopicHover: false});
    }

    rowShareShowHover = () => {
        this.setState({rowShareHover: true});
    }

    rowShareHideHover = () => {
        this.setState({rowShareHover: false});
    }

    resetHover = () => {
        this.hideHover();
        this.rowStartHideHover();
        this.rowStartWithTopicHideHover();
        this.rowShareHideHover();
    }

    showModal = () => {
        this.setState({showPopover: false, showModal: true, shareModal: false});
        this.resetHover();
    }

    showModalAsShare = () => {
        this.setState({showPopover: false, showModal: true, shareModal: true});
        this.resetHover();
    }

    hideModal = () => {
        this.setState({showModal: false});
        this.resetHover();
    }

    startMeeting = async () => {
        await this.props.actions.startMeeting(this.props.channelId, true, this.state.topic);
        this.setState({showPopover: false});
        this.resetHover();
    }

    render() {
        const style = getStyle(this.props.theme);

        const isHovering = this.state.hover || this.state.showPopover;
        const containerStyle = isHovering ? {...style.iconContainer, ...style.iconContainerHover} : style.iconContainer;
        const iconStyle = isHovering ? style.iconButtonHover : style.iconButton;

        return (
            <div>
                <div
                    id='zoomChannelHeaderPopover'
                    style={containerStyle}
                    onMouseEnter={this.showHover}
                    onMouseLeave={this.hideHover}
                >
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        delayShow={400}
                        placement='bottom'
                        overlay={(
                            <Tooltip id='zoomChannelHeaderTooltip'>
                                {'Zoom'}
                            </Tooltip>
                        )}
                    >
                        <div
                            id='zoomChannelHeaderButton'
                            onClick={(e) => {
                                this.setState({popoverTarget: e.target, showPopover: !this.state.showPopover});
                            }}
                        >
                            <span
                                className='fa fa-video-camera'
                                style={iconStyle}
                                aria-hidden='true'
                            />
                        </div>
                    </OverlayTrigger>
                    <Overlay
                        rootClose={true}
                        show={this.state.showPopover}
                        target={() => this.state.popoverTarget}
                        onHide={() => this.setState({showPopover: false})}
                        placement='bottom'
                    >
                        <Popover
                            id='zoomPopover'
                            style={style.popover}
                        >
                            <div style={style.popoverBody}>
                                <div
                                    id='zoomPopoverStartMeeting'
                                    onMouseEnter={this.rowStartShowHover}
                                    onMouseLeave={this.rowStartHideHover}
                                    onClick={this.startMeeting}
                                    style={this.state.rowStartHover ? style.popoverRowHover : {}}
                                >
                                    <span
                                        style={style.popoverIcon}
                                        className='fa fa-video-camera pull-left'
                                        aria-hidden='true'
                                    />
                                    <div style={style.popoverRow}>
                                        <div style={style.popoverText}>
                                            {'Start Zoom Meeting Now'}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id='zoomPopoverStartMeetingWithTopic'
                                    onMouseEnter={this.rowStartWithTopicShowHover}
                                    onMouseLeave={this.rowStartWithTopicHideHover}
                                    onClick={this.showModal}
                                    style={this.state.rowStartWithTopicHover ? style.popoverRowHover : {}}
                                >
                                    <span
                                        style={style.popoverIcon}
                                        className='fa fa-video-camera pull-left'
                                        aria-hidden='true'
                                    />
                                    <div style={style.popoverRow}>
                                        <div style={style.popoverText}>
                                            {'Start Zoom Meeting with Topic'}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id='zoomPopoverShareMeeting'
                                    onMouseEnter={this.rowShareShowHover}
                                    onMouseLeave={this.rowShareHideHover}
                                    onClick={this.showModalAsShare}
                                    style={this.state.rowShareHover ? style.popoverRowHover : {}}
                                >
                                    <span
                                        style={style.popoverIcon}
                                        className='fa fa-share-alt pull-left'
                                        aria-hidden='true'
                                    />
                                    <div style={style.popoverRow}>
                                        <div style={style.popoverText}>
                                            {'Share Zoom Meeting'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popover>
                    </Overlay>
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
        iconContainer: {
            border: '1px solid',
            borderRadius: '50%',
            borderColor: changeOpacity(theme.centerChannelColor, 0.12),
            cursor: 'pointer',
            height: '37px',
            lineHeight: '36px',
            margin: '17px 10px 0 0',
            minWidth: '30px',
            textAlign: 'center',
            width: '37px',
            fill: changeOpacity(theme.centerChannelColor, 0.4)
        },
        iconContainerHover: {
            fill: theme.linkColor,
            borderColor: theme.linkColor
        },
        iconButton: {
            color: '#B1B1B3'
        },
        iconButtonHover: {
            color: theme.linkColor
        },
        popover: {
            marginLeft: '-100px',
            maxWidth: '280px',
            height: '155px',
            width: '280px',
            background: theme.centerChannelBg
        },
        popoverBody: {
            maxHeight: '305px',
            overflow: 'auto',
            position: 'relative',
            width: '280px',
            left: '-14px',
            top: '-9px'
        },
        popoverRow: {
            border: 'none',
            cursor: 'pointer',
            height: '50px',
            margin: '1px 0',
            overflow: 'hidden',
            padding: '6px 19px 0 10px'
        },
        popoverRowHover: {
            borderLeft: '3px solid transparent',
            borderColor: theme.linkColor,
            background: changeOpacity(theme.linkColor, 0.08)
        },
        popoverText: {
            fontSize: '14px',
            fontWeight: 'normal',
            position: 'relative',
            top: '10px'
        },
        popoverIcon: {
            margin: '0',
            paddingLeft: '16px',
            position: 'relative',
            top: '18px',
            fontSize: '18px',
            color: theme.buttonBg
        }
    };
});
