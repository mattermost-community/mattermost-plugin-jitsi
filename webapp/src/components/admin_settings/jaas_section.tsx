import React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    disabled: boolean,
    onAppIDChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onApiKeyIDChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onPrivateKeyChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onEmbeddedChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onCompatibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    apiKey: string,
    appID: string,
    privateKey: string
    embedded: boolean,
    compatibilityMode: boolean
};

const JaaSSection = ({disabled, onApiKeyIDChange, onAppIDChange, onPrivateKeyChange, onEmbeddedChange, onCompatibilityChange, apiKey, appID, privateKey, embedded, compatibilityMode}: Props) => {
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
                            checked={embedded}
                            onChange={onEmbeddedChange}
                        />
                        <span>{'true'}</span>
                    </label>
                    <label className='radio-inline pt-0'>
                        <input
                            type='radio'
                            value='false'
                            checked={!embedded}
                            onChange={onEmbeddedChange}
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
                            checked={compatibilityMode}
                            onChange={onCompatibilityChange}
                        />
                        <span>{'true'}</span>
                    </label>
                    <label className='radio-inline pt-0'>
                        <input
                            type='radio'
                            value='false'
                            checked={!compatibilityMode}
                            onChange={onCompatibilityChange}
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
                        onChange={onAppIDChange}
                        value={appID}
                        disabled={disabled}
                    />
                    <div className='help-text'>
                        <span>
                            <FormattedMessage
                                id='jaas.app-id-description'
                                defaultMessage={'Specify your JaaS AppID. You can get the AppID from https://jaas.8x8.vc/#/apikeys.'}
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div className='form-group'>
                <label className='col-sm-4'>
                    <FormattedMessage
                        id='jaas.api-key-id'
                        defaultMessage={'Api key ID for JaaS Authentication:'}
                    />
                </label>
                <div className='col-sm-8'>
                    <input
                        className='form-control'
                        type='input'
                        maxLength={-1}
                        onChange={onApiKeyIDChange}
                        value={apiKey}
                        disabled={disabled}
                    />
                    <div className='help-text'>
                        <span>
                            <FormattedMessage
                                id='jaas.api-key-id-description'
                                defaultMessage={'Specify your JaaS Api key ID. You can get the Api key ID from https://jaas.8x8.vc/#/apikeys.'}
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
                        onChange={onPrivateKeyChange}
                        value={privateKey}
                        disabled={disabled}
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
};

export default JaaSSection;
