const React = window.react;
const {Overlay, OverlayTrigger, Popover, Tooltip} = window['react-bootstrap'];

import PropTypes from 'prop-types';
import {makeStyleFromTheme, changeOpacity} from 'mattermost-redux/utils/theme_utils';

export default class ChannelHeaderButton extends React.PureComponent {
    static propTypes = {

        /*
         * Logged in user's theme
         */
        theme: PropTypes.object.isRequired,

        /* Add custom props here */

        /* Define action props here or remove if no actions */
        actions: PropTypes.shape({
        }).isRequired

    }

    static defaultProps = {
        /* If necessary, add defaults for custom props here */
    }

    constructor(props) {
        super(props);

        this.state = {
            /* Initialize any state here */
            hover: false,
            rowHover: false
        };
    }

    /* Add React component lifecycle functions (componentDidMount, etc.) and custom functions
        here as needed. Make sure to use arrow function syntax for your custom functions to
        auto-bind this */

    showHover = () => {
        this.setState({hover: true});
    }

    hideHover = () => {
        this.setState({hover: false});
    }

    rowShowHover = () => {
        this.setState({rowHover: true});
    }

    rowHideHover = () => {
        this.setState({rowHover: false});
    }

    /* Construct and return the JSX to render here. Make sure that rendering is solely based
        on props and state. */
    render() {
        const style = getStyle(this.props.theme);

        const isHovering = this.state.hover || this.state.showPopover;
        const containerStyle = isHovering ? {...style.iconContainer, ...style.iconContainerHover} : style.iconContainer;
        const iconStyle = isHovering ? style.iconButtonHover : style.iconButton;

        return (
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
                    onHide={this.closePopover}
                    show={this.state.showPopover}
                    target={() => this.state.popoverTarget}
                    placement='bottom'
                >
                    <Popover
                        id='zoomPopover'
                        style={style.popover}
                    >
                        <div style={style.popoverHeader}>
                            {'Zoom'}
                        </div>
                        <div style={style.popoverBody}>
                            <div
                                id='zoomPopoverStartMeeting'
                                onMouseEnter={this.rowShowHover}
                                onMouseLeave={this.rowHideHover}
                                style={this.state.rowHover ? style.popoverRowHover : {}}
                            >
                                <span
                                    style={style.popoverIcon}
                                    className='fa fa-video-camera pull-left'
                                    aria-hidden='true'
                                />
                                <div style={style.popoverRow}>
                                    <div style={style.popoverText}>
                                        {'Start a meeting'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popover>
                </Overlay>
            </div>
        );
    }
}

/* Define CSS styles here */
const getStyle = makeStyleFromTheme((theme) => {
    return {
        iconContainer: {
            /* Use the theme object to match component style to the user's theme */
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
            maxWidth: 'intitial',
            width: '260px',
            background: theme.centerChannelBg
        },
        popoverHeader: {
            padding: '14px 20px',
            fontWeight: '600'
        },
        popoverBody: {
            borderTop: '1px solid transparent',
            borderColor: changeOpacity(theme.centerChannelColor, 0.1),
            maxHeight: '275px',
            overflow: 'auto',
            position: 'relative'
        },
        popoverRow: {
            border: 'none',
            cursor: 'pointer',
            height: '50px',
            margin: '1px 0',
            overflow: 'hidden',
            padding: '6px 19px 0 20px'
        },
        popoverRowHover: {
            borderLeft: '3px solid transparent',
            borderColor: theme.linkColor,
            background: changeOpacity(theme.linkColor, 0.08)
        },
        popoverText: {
            fontSize: '15.5px',
            fontWeight: 'normal',
            position: 'relative',
            top: '8px'
        },
        popoverIcon: {
            margin: '0',
            position: 'relative',
            top: '18px',
            fontSize: '18px',
            color: theme.buttonBg
        }
    };
});
