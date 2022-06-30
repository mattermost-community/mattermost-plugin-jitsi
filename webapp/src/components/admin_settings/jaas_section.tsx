import * as React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    disabled: boolean,
    onAppIDChange: any,
    onApiKeyChange: any,
    onPrivateKeyChange: any,
    onEmbeddedChange: any,
    onCompatibilityChange: any,
    apiKey: string,
    appID: string,
    privateKey: string
    embedded: boolean,
    compatibilityMode: boolean
};

export default class JaaSSection extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jaas.embed-meeting'
                            defaultMessage={'Embed JaaS video inside Mattermost:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                value='true'
                                checked={this.props.embedded}
                                onChange={this.props.onEmbeddedChange}
                            />
                            <span>{'true'}</span>
                        </label>
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                value='false'
                                checked={!this.props.embedded}
                                onChange={this.props.onEmbeddedChange}
                            />
                            <span>{'false'}</span>
                        </label>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jaas.embed-meeting-description'
                                    defaultMessage={'(Experimental) When true, JaaS video is embedded as a floating window inside Mattermost by default.'}
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
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                value='true'
                                checked={this.props.compatibilityMode}
                                onChange={this.props.onCompatibilityChange}
                            />
                            <span>{'true'}</span>
                        </label>
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                value='false'
                                checked={!this.props.compatibilityMode}
                                onChange={this.props.onCompatibilityChange}
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
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jaas.app-id'
                            defaultMessage={'AppID for JaaS Authentication:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type='input'
                            maxLength={-1}
                            onChange={this.props.onAppIDChange}
                            value={this.props.appID}
                            disabled={this.props.disabled}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jaas.app-id-description'
                                    defaultMessage={'Specify your JaaS AppID. You can get the AppID from https://jaas.8x8.vc/#/apikeys .'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jaas.api-id'
                            defaultMessage={'Api ID for JaaS Authentication:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <input
                            className='form-control'
                            type='input'
                            maxLength={-1}
                            onChange={this.props.onApiKeyChange}
                            value={this.props.apiKey}
                            disabled={this.props.disabled}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jaas.api-id-description'
                                    defaultMessage={'Specify your JaaS Api ID. You can get the Api ID from https://jaas.8x8.vc/#/apikeys .'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jaas.rsa-key'
                            defaultMessage={'RSA Private key for JaaS Authentication:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <textarea
                            className='form-control'
                            maxLength={-1}
                            rows={5}
                            onChange={this.props.onPrivateKeyChange}
                            value={this.props.privateKey}
                            disabled={this.props.disabled}
                        />
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jaas.rsa-key-description'
                                    defaultMessage={'Specify your JaaS private key. You can get the private key by generating an API key pair from https://jaas.8x8.vc/#/apikeys OR from https://jaas.8x8.vc/#/start-guide in the "Api Key" section. (NOTE: While generating the key manually make sure to set the size to be 2048 and not 4096).'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
