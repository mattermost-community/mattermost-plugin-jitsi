import * as React from 'react';

import {Post} from 'mattermost-redux/types/posts';

import Svgs from '../../constants/svgs';

import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export type Props = {
    post?: Post,
    theme: any,
    creatorName: string,
    useMilitaryTime: boolean,
    actions: {
        enrichMeetingJwt: (jwt: string) => any
    }
}

type State = {
    meetingJwt?: string
}

export class PostTypeJitsi extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const {post} = this.props;
        if (post) {
            if (post.props.jwt_meeting) {
                this.props.actions.enrichMeetingJwt(post.props.meeting_jwt).then((response: any) => {
                    if (response.data) {
                        this.setState({meetingJwt: response.data.jwt});
                    }
                });
            }
        }
    }

    renderUntilDate = (post: Post, style: any): React.ReactNode => {
        const props = post.props;

        if (props.jwt_meeting) {
            const date = new Date(props.jwt_meeting_valid_until * 1000);
            let dateStr = props.jwt_meeting_valid_until;
            if (!isNaN(date.getTime())) {
                dateStr = date.toString();
            }
            return (<div style={style.validUntil}>{' Meeting link valid until: '} <b>{dateStr}</b></div>);
        }
        return null;
    }

    render() {
        const style = getStyle(this.props.theme);
        const post = this.props.post;
        if (!post) {
            return null;
        }

        const props = post.props;

        let meetingLink = props.meeting_link;
        if (this.state.meetingJwt) {
            meetingLink += '?jwt=' + this.state.meetingJwt;
        } else if (props.jwt_meeting) {
            meetingLink += '?jwt=' + (props.meeting_jwt);
        }

        const preText = `${this.props.creatorName} has started a meeting`;

        const content = (
            <div>
                <a
                    className='btn btn-lg btn-primary'
                    style={style.button}
                    target='_blank'
                    rel='noopener noreferrer'
                    href={meetingLink}
                >
                    <i
                        style={style.buttonIcon}
                        dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA_3}}
                    />
                    {'JOIN MEETING'}
                </a>
            </div>
        );

        let subtitle;
        if (props.meeting_personal) {
            subtitle = (
                <span>
                    {'Personal Meeting ID (PMI): '}
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={meetingLink}
                    >
                        {props.meeting_id}
                    </a>
                </span>
            );
        } else {
            subtitle = (
                <span>
                    {'Meeting ID: '}
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={meetingLink}
                    >
                        {props.meeting_id}
                    </a>
                </span>
            );
        }

        let title = 'Jitsi Meeting';
        if (props.meeting_topic) {
            title = props.meeting_topic;
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
                                    {this.renderUntilDate(post, style)}
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
            borderRadius: '4px',
            color: theme.buttonColor
        },
        buttonIcon: {
            paddingRight: '8px',
            fill: theme.buttonColor
        },
        validUntil: {
            marginTop: '10px'
        }
    };
});
