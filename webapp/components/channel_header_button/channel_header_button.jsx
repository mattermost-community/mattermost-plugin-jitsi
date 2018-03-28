const React = window.react;
const {Overlay, OverlayTrigger, Popover, Tooltip} = window['react-bootstrap'];

import ShareMeetingModal from '../share_meeting_modal';

import {Svgs} from '../../constants';

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
            rowStartHover: false,
            rowStartWithTopicHover: false,
            rowShareHover: false,
            showModal: false,
            shareModal: false
        };
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
        if (this.props.channelId === '') {
            return <div/>;
        }

        const style = getStyle(this.props.theme);

        return (
            <div>
                <div
                    id='zoomChannelHeaderPopover'
                    className={this.state.showPopover ? 'channel-header__icon active' : 'channel-header__icon'}
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
                                style={style.iconStyle}
                                aria-hidden='true'
                                dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA}}
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
                                    style={this.state.rowStartHover ? style.popoverRowHover : style.popoverRowNoHover}
                                >
                                    <span
                                        style={style.popoverIcon}
                                        className='pull-left'
                                        dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA_2}}
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
                                    style={this.state.rowStartWithTopicHover ? style.popoverRowHover : style.popoverRowNoHover}
                                >
                                    <span
                                        style={style.popoverIcon}
                                        className='pull-left'
                                        aria-hidden='true'
                                        dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA_2}}
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
                                    style={this.state.rowShareHover ? style.popoverRowHover : style.popoverRowNoHover}
                                >
                                    <span
                                        style={{...style.popoverIcon, top: '16px'}}
                                        className='pull-left'
                                        dangerouslySetInnerHTML={{__html: Svgs.SHARE}}
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
        iconStyle: {
            position: 'relative',
            top: '-1px'
        },
        popover: {
            marginLeft: '-100px',
            maxWidth: '285px',
            height: '155px',
            width: '285px',
            background: theme.centerChannelBg
        },
        popoverBody: {
            maxHeight: '305px',
            overflow: 'auto',
            position: 'relative',
            width: '283px',
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
        popoverRowNoHover: {
            borderLeft: '3px solid',
            borderColor: theme.centerChannelBg,
            fontWeight: 'normal'
        },
        popoverRowHover: {
            borderLeft: '3px solid transparent',
            borderColor: theme.linkColor,
            background: changeOpacity(theme.linkColor, 0.08),
            fontWeight: 'bold'
        },
        popoverText: {
            fontWeight: 'inherit',
            fontSize: '14px',
            position: 'relative',
            top: '10px',
            left: '4px'
        },
        popoverIcon: {
            margin: '0',
            paddingLeft: '16px',
            position: 'relative',
            top: '14px',
            fontSize: '18px',
            fill: theme.buttonBg
        }
    };
});
