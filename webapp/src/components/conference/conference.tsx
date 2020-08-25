import * as React from 'react';
import {FormattedMessage} from 'react-intl';

import {Post} from 'mattermost-redux/types/posts';

const BORDER_SIZE = 8;
const POSITION_TOP = 'top';
const POSITION_BOTTOM = 'bottom';
const BUTTONS_PADDING_TOP = 10;
const BUTTONS_PADDING_RIGHT = 2;
const MINIMIZED_WIDTH = 384;
const MINIMIZED_HEIGHT = 288;

type Props = {
    post: Post | null,
    jwt: string | null,
    actions: {
        openJitsiMeeting: (post: Post | null, jwt: string | null) => void
    }
}

type State = {
    minimized: boolean,
    position: typeof POSITION_TOP | typeof POSITION_BOTTOM,
    loading: boolean,
    wasTileView: boolean,
    isTileView: boolean,
    wasFilmStrip: boolean,
    isFilmStrip: boolean
}

export default class Conference extends React.PureComponent<Props, State> {
    api: any

    constructor(props: Props) {
        super(props);
        this.state = {
            minimized: true,
            position: POSITION_BOTTOM,
            loading: true,
            wasTileView: true,
            isTileView: true,
            wasFilmStrip: true,
            isFilmStrip: true
        };
    }

    getViewportWidth(): number {
        return Math.max(document.documentElement.clientWidth || 0, window?.innerWidth || 0) - (BORDER_SIZE * 2);
    }

    getViewportHeight(): number {
        return Math.max(document.documentElement.clientHeight || 0, window?.innerHeight || 0) - (BORDER_SIZE * 2);
    }

    preventMessages = (event: MessageEvent) => {
        if (!this.props.post || !this.api) {
            return;
        }
        const meetingURL = new URL(this.props.post.props.meeting_link);
        if (event.origin !== meetingURL.origin && event.data) {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (err) {
                data = {};
            }
            if (data.postis && data.scope.indexOf('jitsi_meet_external_api_') === 0) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }
    }

    initJitsi = (post: Post) => {
        const vw = this.getViewportWidth();
        const vh = this.getViewportHeight();

        const url = new URL(post.props.meeting_link);

        const noSSL = url.protocol === 'http:';

        const domain = url.host;
        const options = {
            roomName: post.props.meeting_id,
            width: this.state.minimized ? MINIMIZED_WIDTH : vw,
            height: this.state.minimized ? MINIMIZED_HEIGHT : vh,
            jwt: this.props.jwt,
            noSSL,
            parentNode: document.querySelector('#jitsiMeet'),
            onload: () => {
                this.setState({loading: false});
                this.resizeIframe();
            }
        };
        this.api = new (window as any).JitsiMeetExternalAPI(domain, options);
        this.api.on('videoConferenceJoined', () => {
            if (this.state.minimized) {
                this.minimize();
            }
        });
        this.api.on('readyToClose', () => {
            this.close();
        });
        this.api.on('tileViewChanged', (event: {enabled: boolean}) => {
            if (!this.state.minimized) {
                this.setState({wasTileView: event.enabled});
            }
            this.setState({isTileView: event.enabled});
        });
        this.api.on('filmstripDisplayChanged', (event: {visible: boolean}) => {
            if (!this.state.minimized) {
                this.setState({wasFilmStrip: event.visible});
            }
            this.setState({isFilmStrip: event.visible});
        });
        this.api.executeCommand('subject', post.props.meeting_topic || post.props.default_meeting_topic);
    }

    resizeIframe = () => {
        if (this.api && this.props.post) {
            const vw = this.getViewportWidth();
            const vh = this.getViewportHeight();
            const iframe = this.api.getIFrame();
            iframe.style.width = this.state.minimized ? MINIMIZED_WIDTH + 'px' : vw + 'px';
            iframe.style.height = this.state.minimized ? MINIMIZED_HEIGHT + 'px' : vh + 'px';
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeIframe);
        window.addEventListener('message', this.preventMessages, false);
        window.requestAnimationFrame(() => {
            if (this.props.post) {
                this.initJitsi(this.props.post);
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeIframe);
        window.removeEventListener('message', this.preventMessages, false);
        if (this.api) {
            this.api.dispose();
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.post) {
            if (prevProps.post !== this.props.post) {
                if (this.api) {
                    this.api.dispose();
                }
                this.initJitsi(this.props.post);
            }
            if (prevState.minimized !== this.state.minimized) {
                this.resizeIframe();
            }
        }
    }

    close = () => {
        this.api.executeCommand('hangup');
        setTimeout(() => {
            this.props.actions.openJitsiMeeting(null, null);
            this.setState({
                minimized: true,
                loading: true,
                position: POSITION_BOTTOM,
                wasTileView: true,
                isTileView: true,
                wasFilmStrip: true,
                isFilmStrip: true
            });
            if (this.api) {
                this.api.dispose();
            }
        }, 200);
    }

    minimize = () => {
        this.setState({minimized: true});
        if (this.state.isTileView) {
            this.api.executeCommand('toggleTileView');
        }
        if (this.state.isFilmStrip) {
            this.api.executeCommand('toggleFilmStrip');
        }
    }

    maximize = () => {
        this.setState({minimized: false});
        if (this.state.isTileView !== this.state.wasTileView) {
            this.api.executeCommand('toggleTileView');
        }
        if (this.state.isFilmStrip !== this.state.wasFilmStrip) {
            this.api.executeCommand('toggleFilmStrip');
        }
    }

    togglePosition= () => {
        if (this.state.position === POSITION_TOP) {
            this.setState({position: POSITION_BOTTOM});
        } else {
            this.setState({position: POSITION_TOP});
        }
    }

    renderButtons = (style: {[key: string]: React.CSSProperties}): React.ReactNode => {
        const {post} = this.props;
        if (post === null) {
            return null;
        }
        let meetingLink = post.props.meeting_link;
        if (this.props.jwt) {
            meetingLink += `?jwt=${this.props.jwt}`;
        }
        meetingLink += `#config.callDisplayName="${post.props.meeting_topic || post.props.default_meeting_topic}"`;

        return (
            <div style={style.buttons}>
                {this.state.minimized && this.state.position === POSITION_TOP &&
                    <FormattedMessage
                        id='jitsi.move-down'
                        defaultMessage='Move down'
                    >
                        {(text: string) => (
                            <i
                                onClick={this.togglePosition}
                                style={{transform: 'rotate(270deg)', display: 'inline-block'}}
                                className='icon icon-arrow-left'
                                aria-label={text}
                                title={text}
                            />
                        )}
                    </FormattedMessage>}
                {this.state.minimized && this.state.position === POSITION_BOTTOM &&
                    <FormattedMessage
                        id='jitsi.move-up'
                        defaultMessage='Move up'
                    >
                        {(text: string) => (
                            <i
                                onClick={this.togglePosition}
                                style={{transform: 'rotate(90deg)', display: 'inline-block'}}
                                className='icon icon-arrow-left'
                                aria-label={text}
                                title={text}
                            />
                        )}
                    </FormattedMessage>}
                {!this.state.minimized &&
                    <FormattedMessage
                        id='jitsi.minimize'
                        defaultMessage='Minimize'
                    >
                        {(text: string) => (
                            <i
                                onClick={this.minimize}
                                className='icon icon-arrow-collapse'
                                aria-label={text}
                                title={text}
                            />
                        )}
                    </FormattedMessage>}
                {this.state.minimized &&
                    <FormattedMessage
                        id='jitsi.maximize'
                        defaultMessage='Maximize'
                    >
                        {(text: string) => (
                            <i
                                onClick={this.maximize}
                                className='icon icon-arrow-expand'
                                aria-label={text}
                                title={text}
                            />
                        )}
                    </FormattedMessage>}
                <a
                    style={{color: 'white'}}
                    onClick={this.close}
                    target='_blank'
                    rel='noopener noreferrer'
                    href={meetingLink}
                >
                    <FormattedMessage
                        id='jitsi.open-in-new-tab'
                        defaultMessage='Open in new tab'
                    >
                        {(text: string) => (
                            <i
                                style={{transform: 'rotate(135deg)', display: 'inline-block'}}
                                className='icon icon-arrow-left'
                                aria-label={text}
                                title={text}
                            />
                        )}
                    </FormattedMessage>
                </a>
                <FormattedMessage
                    id='jitsi.close'
                    defaultMessage='Close'
                >
                    {(text: string) => (
                        <i
                            onClick={this.close}
                            className='icon icon-close'
                            aria-label={text}
                            title={text}
                        />
                    )}
                </FormattedMessage>
            </div>);
    }

    render() {
        if (this.props.post === null) {
            return null;
        }
        const vw = this.getViewportWidth();
        const width = this.state.minimized ? MINIMIZED_WIDTH : vw;
        const vh = this.getViewportHeight();
        const height = this.state.minimized ? MINIMIZED_HEIGHT : vh;
        const style = getStyle(height, width, this.state.position);
        return (
            <React.Fragment>
                <div
                    id='jitsiMeet'
                    style={style.jitsiMeetContainer}
                />

                {!this.state.minimized &&
                    <div style={style.background}/>}

                {this.state.loading &&
                    <div style={style.loading}>
                        <i className='fa fa-spinner fa-fw fa-pulse spinner'/>
                    </div>}

                {this.renderButtons(style)}
            </React.Fragment>
        );
    }
}

function getStyle(height: number, width: number, position: 'top' | 'bottom'): {[key: string]: React.CSSProperties} {
    const backgroundZIndex = 1000;
    const jitsiZIndex = 1100;
    const buttonsZIndex = 1200;
    const loadingZIndex = 1200;

    return {
        jitsiMeetContainer: {
            position: 'absolute',
            height,
            width,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#474747',
            bottom: position === POSITION_BOTTOM ? `${BORDER_SIZE}px` : '',
            top: position === POSITION_TOP ? `${BORDER_SIZE}px` : '',
            right: `${BORDER_SIZE}px`,
            zIndex: jitsiZIndex
        },
        loading: {
            position: 'absolute',
            height,
            width,
            background: '#00000077',
            bottom: position === POSITION_BOTTOM ? `${BORDER_SIZE}px` : '',
            top: position === POSITION_TOP ? `${BORDER_SIZE}px` : '',
            right: `${BORDER_SIZE}px`,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            zIndex: loadingZIndex,
            fontSize: '48px',
            opacity: 0.85,
            color: 'white'
        },
        background: {
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'black',
            opacity: 0.7,
            width: '100%',
            height: '100%',
            zIndex: backgroundZIndex
        },
        buttons: {
            position: 'absolute',
            bottom: position === POSITION_BOTTOM ? ((height - BORDER_SIZE) - BUTTONS_PADDING_TOP) + 'px' : '',
            top: position === POSITION_TOP ? `${BORDER_SIZE}px` : '',
            right: `${BORDER_SIZE + BUTTONS_PADDING_RIGHT}px`,
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: 0.85,
            zIndex: buttonsZIndex
        }
    };
}
