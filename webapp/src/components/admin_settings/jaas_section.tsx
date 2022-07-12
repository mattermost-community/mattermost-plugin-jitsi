import React, {useMemo} from 'react';
import {FormattedMessage} from 'react-intl';

import {InputFieldType} from 'types';
import {TextInput} from '../InputField';
import {RadioField} from '../RadioField';

type Props = {
    disable: boolean,
    onAppIDChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onApiKeyIDChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onPrivateKeyChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onEmbeddedChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onCompatibilityChange: (e: React.ChangeEvent<InputFieldType>) => void,
    apiKey: string,
    appID: string,
    privateKey: string
    embedded: boolean,
    compatibilityMode: boolean
};

const JaaSSection = ({disable, onApiKeyIDChange, onAppIDChange, onPrivateKeyChange, onEmbeddedChange, onCompatibilityChange, apiKey, appID, privateKey, embedded, compatibilityMode}: Props) => {
    const EMBED_JAAS_VIDEO_INSIDE_MATTERMOST_OPTIONS = useMemo(() => [
        {
            value: 'true',
            checked: embedded,
            id: 'jitsi.true',
            message: 'true'
        },
        {
            value: 'false',
            checked: !embedded,
            id: 'jitsi.false',
            message: 'false'
        }
    ], [embedded]);

    const JAAS_COMPATIBILITY_OPTIONS = useMemo(() => [
        {
            value: 'true',
            checked: compatibilityMode,
            id: 'jitsi.true',
            message: 'true'
        },
        {
            value: 'false',
            checked: !compatibilityMode,
            id: 'jitsi.false',
            message: 'false'
        }
    ], [compatibilityMode]);

    return (
        <div>
            <RadioField
                heading={
                    <FormattedMessage
                        id='jaas.embed-meeting'
                        defaultMessage={'Embed JaaS video inside Mattermost:'}
                    />
                }
                isInline={true}
                options={EMBED_JAAS_VIDEO_INSIDE_MATTERMOST_OPTIONS}
                onChange={onEmbeddedChange}
                description={
                    <FormattedMessage
                        id='jaas.embed-meeting-description'
                        defaultMessage={'(Experimental) When true, JaaS video is embedded as a floating window inside Mattermost by default.'}
                    />
                }
            />
            <RadioField
                heading={
                    <FormattedMessage
                        id='jaas.enable-compatibility-mod'
                        defaultMessage={'Enable Compatibility Mode:'}
                    />
                }
                isInline={true}
                options={JAAS_COMPATIBILITY_OPTIONS}
                onChange={onCompatibilityChange}
                description={
                    <FormattedMessage
                        id='jaas.enable-compatibility-mode-description'
                        defaultMessage={'(Insecure) If your JaaS server is not compatible with this plugin, include the JavaScript API hosted on your Jaas server directly in Mattermost instead of the default API version provided by the plugin. WARNING: Enabling this setting can compromise the security of your Mattermost system, if your JaaS server is not fully trusted and allows direct modification of program files. Use with caution.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jaas.app-id'
                        defaultMessage={'AppID for JaaS Authentication:'}
                    />
                }
                tagType={'input'}
                type={'input'}
                onChange={onAppIDChange}
                value={appID}
                disabled={disable}
                description={
                    <FormattedMessage
                        id='jaas.app-id-description'
                        defaultMessage={'Specify your JaaS AppID. You can get the AppID from https://jaas.8x8.vc/#/apikeys.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jaas.api-key-id'
                        defaultMessage={'Api key ID for JaaS Authentication:'}
                    />
                }
                tagType={'input'}
                type={'input'}
                onChange={onApiKeyIDChange}
                value={apiKey}
                disabled={disable}
                description={
                    <FormattedMessage
                        id='jaas.api-key-id-description'
                        defaultMessage={'Specify your JaaS Api key ID. You can get the Api key ID from https://jaas.8x8.vc/#/apikeys.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jaas.rsa-key'
                        defaultMessage={'RSA Private key for JaaS Authentication:'}
                    />
                }
                tagType={'textarea'}
                rows={5}
                onChange={onPrivateKeyChange}
                value={privateKey}
                disabled={disable}
                description={
                    <FormattedMessage
                        id='jaas.rsa-key-description'
                        defaultMessage={'Specify your JaaS private key. You can get the private key by generating an API key pair from https://jaas.8x8.vc/#/apikeys OR from https://jaas.8x8.vc/#/start-guide in the "Api Key" section. (NOTE: While generating the key manually make sure to set the size to be 2048 and not 4096).'}
                    />
                }
            />
        </div>
    );
};

export default JaaSSection;
