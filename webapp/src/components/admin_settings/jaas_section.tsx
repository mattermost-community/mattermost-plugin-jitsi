import React from 'react';
import {InputField} from '../InputField';
import {RadioField} from '../RadioField';

type Props = {
    disable: boolean,
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

const JaaSSection = ({disable, onApiKeyIDChange, onAppIDChange, onPrivateKeyChange, onEmbeddedChange, onCompatibilityChange, apiKey, appID, privateKey, embedded, compatibilityMode}: Props) => {
    const EMBED_JAAS_VIDEO_INSIDE_MATTERMOST_OPTIONS = [
        {
            value: 'true',
            checked: embedded,
            id: 'jaas.embed-enable',
            message: 'true'
        },
        {
            value: 'false',
            checked: !embedded,
            id: 'jaas.embed-disable',
            message: 'false'
        }
    ];

    const JAAS_COMPATIBILITY_OPTIONS = [
        {
            value: 'true',
            checked: compatibilityMode,
            id: 'jaas.compatibility-enable',
            message: 'true'
        },
        {
            value: 'false',
            checked: !compatibilityMode,
            id: 'jaas.compatibility-disable',
            message: 'false'
        }
    ];

    return (
        <div>
            <RadioField
                heading={{
                    id: 'jaas.embed-meeting',
                    message: 'Embed JaaS video inside Mattermost:'
                }}
                labelClass={'radio-inline'}
                options={EMBED_JAAS_VIDEO_INSIDE_MATTERMOST_OPTIONS}
                onChange={onEmbeddedChange}
                description={{
                    id: 'jaas.embed-meeting-description',
                    message: '(Experimental) When true, JaaS video is embedded as a floating window inside Mattermost by default.'
                }}
            />
            <RadioField
                heading={{
                    id: 'jaas.enable-compatibility-mode',
                    message: 'Enable Compatibility Mode:'
                }}
                labelClass={'radio-inline'}
                options={JAAS_COMPATIBILITY_OPTIONS}
                onChange={onCompatibilityChange}
                description={{
                    id: 'jaas.enable-compatibility-mode-description',
                    message: '(Insecure) If your JaaS server is not compatible with this plugin, include the JavaScript API hosted on your Jaas server directly in Mattermost instead of the default API version provided by the plugin. WARNING: Enabling this setting can compromise the security of your Mattermost system, if your JaaS server is not fully trusted and allows direct modification of program files. Use with caution.'
                }}
            />
            <InputField
                heading={{
                    id: 'jaas.app-id',
                    message: 'AppID for JaaS Authentication:'
                }}
                tagType={'input'}
                input={{
                    type: 'input',
                    maxLength: -1,
                    onChange: onAppIDChange,
                    value: appID,
                    disabled: disable
                }}
                description={{
                    id: 'jaas.app-id-description',
                    message: 'Specify your JaaS AppID. You can get the AppID from https://jaas.8x8.vc/#/apikeys.'
                }}
            />
            <InputField
                heading={{
                    id: 'jaas.api-key-id',
                    message: 'Api key ID for JaaS Authentication:'
                }}
                tagType={'input'}
                input={{
                    type: 'input',
                    maxLength: -1,
                    onChange: onApiKeyIDChange,
                    value: apiKey,
                    disabled: disable
                }}
                description={{
                    id: 'jaas.api-key-id-description',
                    message: 'Specify your JaaS Api key ID. You can get the Api key ID from https://jaas.8x8.vc/#/apikeys.'
                }}
            />
            <InputField
                heading={{
                    id: 'jaas.rsa-key',
                    message: 'RSA Private key for JaaS Authentication:'
                }}
                tagType={'textarea'}
                input={{
                    maxLength: -1,
                    rows: 5,
                    onChange: onPrivateKeyChange,
                    value: privateKey,
                    disabled: disable
                }}
                description={{
                    id: 'jaas.rsa-key-description',
                    message: 'Specify your JaaS private key. You can get the private key by generating an API key pair from https://jaas.8x8.vc/#/apikeys OR from https://jaas.8x8.vc/#/start-guide in the "Api Key" section. (NOTE: While generating the key manually make sure to set the size to be 2048 and not 4096).'
                }}
            />
        </div>
    );
};

export default JaaSSection;
