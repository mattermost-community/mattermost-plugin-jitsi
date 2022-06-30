import * as React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    disabled: boolean,
    onJitsiURLChange: any,
    onJitsiEmbeddedChange: any,
    onJitsiMeetingNamesChange: any,
    onJitsiJwtAuthChange: any,
    onJitsiAppIDChange: any,
    onJitsiAppSecretChange: any,
    onJitsiMeetingLinkExpChange: any,
    onJitsiCompatibilityChange: any,
    serverUrl: string,
    embedded: boolean,
    namingScheme: string,
    jwtEnabled: boolean,
    appID: string,
    appSecret: string,
    meetingLinkExpire: number,
    compatibilityMode: boolean
};

export const JITSI_NAMING_SCHEME = {
    WORDS: 'words',
    UUID: 'uuid',
    MATTERMOST: 'mattermost',
    ASK: 'ask'
};

export class JitsiSection extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    render() {
        // TODO rewrite common components or use Mattermost components
        return (
            <div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.server-url'
                            defaultMessage={'Jitsi Server URL:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type='input'
                            placeholder='https://meet.jit.si'
                            maxLength={-1}
                            onChange={this.props.onJitsiURLChange}
                            value={this.props.serverUrl}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.example-server-url'
                                    defaultMessage={'The url for your Jitsi server, for example '}
                                />
                                <a
                                    href='#'
                                    target='_blank'
                                    rel='noreferrer'
                                >{'https://jitsi.example.com'}</a>
                                {'. Defaults to '}
                                <a
                                    href='https://meet.jit.si'
                                    target='_blank'
                                    rel='noreferrer'
                                >{'https://meet.jit.si'}</a>
                                <FormattedMessage
                                    id='jitsi.public-server-url'
                                    defaultMessage={', which is the public server provided by Jitsi.'}
                                />
                                {', which is the public server provided by Jitsi.'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.embed-video'
                            defaultMessage={'Embed Jitsi video inside Mattermost:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='true'
                                checked={this.props.embedded}
                                onChange={this.props.onJitsiEmbeddedChange}
                            />
                            <span>{'true'}</span>
                        </label>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='false'
                                checked={!this.props.embedded}
                                onChange={this.props.onJitsiEmbeddedChange}
                            />
                            <span>{'false'}</span>
                        </label>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.embed-video-description'
                                    defaultMessage={'(Experimental) When true, Jitsi video is embedded as a floating window inside Mattermost by default. Users can override this setting with \'/jitsi settings\'.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.meeting-names'
                            defaultMessage={'Jitsi Meeting Names:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    value={JITSI_NAMING_SCHEME.WORDS}
                                    checked={this.props.namingScheme === JITSI_NAMING_SCHEME.WORDS}
                                    onChange={this.props.onJitsiMeetingNamesChange}
                                />
                                <FormattedMessage
                                    id='jitsi.random-english-words'
                                    defaultMessage={'Random English words in title case (e.g. PlayfulDragonsObserveCuriously)'}
                                />
                            </label>
                        </div>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    value={JITSI_NAMING_SCHEME.UUID}
                                    checked={this.props.namingScheme === JITSI_NAMING_SCHEME.UUID}
                                    onChange={this.props.onJitsiMeetingNamesChange}
                                />
                                <FormattedMessage
                                    id='jitsi.uuid'
                                    defaultMessage={'UUID (universally unique identifier)'}
                                />
                            </label>
                        </div>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    value={JITSI_NAMING_SCHEME.MATTERMOST}
                                    checked={this.props.namingScheme === JITSI_NAMING_SCHEME.MATTERMOST}
                                    onChange={this.props.onJitsiMeetingNamesChange}
                                />
                                <FormattedMessage
                                    id='jitsi.context-specific'
                                    defaultMessage={'Mattermost context specific names. Combination of team name, channel name, and random text in Public and Private channels; personal meeting name in Direct and Group Message channels.'}
                                />
                            </label>
                        </div>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    value={JITSI_NAMING_SCHEME.ASK}
                                    checked={this.props.namingScheme === JITSI_NAMING_SCHEME.ASK}
                                    onChange={this.props.onJitsiMeetingNamesChange}
                                />
                                <FormattedMessage
                                    id='jitsi.allow-user'
                                    defaultMessage={'Allow user to select meeting name'}
                                />
                            </label>
                        </div>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.meeting-names-description'
                                    defaultMessage={'Select how meeting names are generated by default. Users can override this setting with \'/jitsi settings\'.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.use-jwt'
                            defaultMessage={'Use JWT Authentication for Jitsi:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='true'
                                checked={this.props.jwtEnabled}
                                onChange={this.props.onJitsiJwtAuthChange}
                            />
                            <span>{'true'}</span>
                        </label>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='false'
                                checked={!this.props.jwtEnabled}
                                onChange={this.props.onJitsiJwtAuthChange}
                            />
                            <span>{'false'}</span>
                        </label>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.use-jwt-description'
                                    defaultMessage={'(Optional) If your Jitsi server uses JSON Web Tokens (JWT) for authentication, set this value to true.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.app-id'
                            defaultMessage={'App ID for JWT Authentication:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type='input'
                            maxLength={-1}
                            onChange={this.props.onJitsiAppIDChange}
                            value={this.props.appID}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.app-id-description'
                                    defaultMessage={'(Optional) The app ID used for authentication by the Jitsi server and JWT token generator.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.app-secret'
                            defaultMessage={'App Secret for JWT Authentication:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type='input'
                            maxLength={-1}
                            onChange={this.props.onJitsiAppSecretChange}
                            value={this.props.appSecret}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.app-secret-description'
                                    defaultMessage={'(Optional) The app secret used for authentication by the Jitsi server and JWT token generator.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.link-expiry-time'
                            defaultMessage={'Meeting Link Expiry Time (minutes):'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type={'number'}
                            min={1}
                            defaultValue={30}
                            onChange={this.props.onJitsiMeetingLinkExpChange}
                            value={this.props.meetingLinkExpire}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.link-expiry-time-description'
                                    defaultMessage={'(Optional) The number of minutes from when the meeting link is created to when it becomes invalid. Minimum is 1 minute. Only applies if using JWT authentication for your Jitsi server.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.enable-compatibility-mode'
                            defaultMessage={'Enable Compatibility Mode:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='true'
                                checked={this.props.compatibilityMode}
                                onChange={this.props.onJitsiCompatibilityChange}
                            />
                            <span>{'true'}</span>
                        </label>
                        <label className='radio-inline'>
                            <input
                                type='radio'
                                value='false'
                                checked={!this.props.compatibilityMode}
                                onChange={this.props.onJitsiCompatibilityChange}
                            />
                            <span>{'false'}</span>
                        </label>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.enable-compatibility-mode-description'
                                    defaultMessage={'(Insecure) If your Jitsi server is not compatible with this plugin, include the JavaScript API hosted on your Jitsi server directly in Mattermost instead of the default API version provided by the plugin. WARNING: Enabling this setting can compromise the security of your Mattermost system, if your Jitsi server is not fully trusted and allows direct modification of program files. Use with caution.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
