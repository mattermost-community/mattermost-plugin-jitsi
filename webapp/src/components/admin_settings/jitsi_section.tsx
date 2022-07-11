import * as React from 'react';

import {InputField} from '../InputField';
import {RadioField} from '../RadioField';

type Props = {
    disabled: boolean,
    onJitsiURLChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiEmbeddedChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiMeetingNamesChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiJwtAuthChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiAppIDChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiAppSecretChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiMeetingLinkExpChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onJitsiCompatibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
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

const JitsiSection = (props: Props) => {
    const EMBED_JITSI_VIDEO_INSIDE_MATTERMOST_OPTIONS = [
        {
            value: 'true',
            checked: props.embedded,
            id: 'jitsi.embed-enable',
            message: 'true'
        },
        {
            value: 'false',
            checked: !props.embedded,
            id: 'jitsi.embed-disable',
            message: 'false'
        }
    ];

    const JITSI_MEETING_NAMES_OPTIONS = [
        {
            value: JITSI_NAMING_SCHEME.WORDS,
            checked: props.namingScheme === JITSI_NAMING_SCHEME.WORDS,
            id: 'jitsi.random-english-words',
            message: 'Random English words in title case (e.g. PlayfulDragonsObserveCuriously)'
        },
        {
            value: JITSI_NAMING_SCHEME.UUID,
            checked: props.namingScheme === JITSI_NAMING_SCHEME.UUID,
            id: 'jitsi.uuid',
            message: 'UUID (universally unique identifier)'
        },
        {
            value: JITSI_NAMING_SCHEME.MATTERMOST,
            checked: props.namingScheme === JITSI_NAMING_SCHEME.MATTERMOST,
            id: 'jitsi.context-specific',
            message: 'Mattermost context specific names. Combination of team name, channel name, and random text in Public and Private channels; personal meeting name in Direct and Group Message channels.'
        },
        {
            value: JITSI_NAMING_SCHEME.ASK,
            checked: props.namingScheme === JITSI_NAMING_SCHEME.ASK,
            id: 'jitsi.allow-user',
            message: 'Allow user to select meeting name'
        }
    ];

    const JITSI_USE_JWT_OPTIONS = [
        {
            value: 'true',
            checked: props.jwtEnabled,
            id: 'jitsi.jwt-enable',
            message: 'true'
        },
        {
            value: 'false',
            checked: !props.jwtEnabled,
            id: 'jitsi.jwt-disable',
            message: 'false'
        }
    ];

    const JITSI_COMPATIBILITY_OPTIONS = [
        {
            value: 'true',
            checked: props.compatibilityMode,
            id: 'jitsi.compatibility-enable',
            message: 'true'
        },
        {
            value: 'false',
            checked: !props.compatibilityMode,
            id: 'jitsi.compatibility-disable',
            message: 'false'
        }
    ];

    // TODO rewrite common components or use Mattermost components
    return (
        <div>
            <InputField
                heading={{
                    id: 'jitsi.server-url',
                    message: 'Jitsi Server URL:'
                }}
                tagType={'input'}
                input={{
                    type: 'input',
                    placeholder: 'https://meet.jit.si',
                    maxLength: -1,
                    onChange: props.onJitsiURLChange,
                    value: props.serverUrl
                }}
                description={{
                    id: 'jitsi.server-url-description',
                    message: 'The url for your Jitsi server, for example https://jitsi.example.com. Defaults to https://meet.jit.si, which is the public server provided by Jitsi.'
                }}
            />
            <RadioField
                heading={{
                    id: 'jitsi.embed-video',
                    message: 'Embed Jitsi video inside Mattermost:'
                }}
                labelClass={'radio-inline'}
                options={EMBED_JITSI_VIDEO_INSIDE_MATTERMOST_OPTIONS}
                onChange={props.onJitsiEmbeddedChange}
                description={{
                    id: 'jitsi.embed-video-description',
                    message: '(Experimental) When true, Jitsi video is embedded as a floating window inside Mattermost by default. Users can override this setting with \'/jitsi settings\'.'
                }}
            />
            <RadioField
                heading={{
                    id: 'jitsi.meeting-names',
                    message: 'Jitsi Meeting Names:'
                }}
                divClass={'radio'}
                options={JITSI_MEETING_NAMES_OPTIONS}
                onChange={props.onJitsiMeetingNamesChange}
                description={{
                    id: 'jitsi.meeting-names-description',
                    message: 'Select how meeting names are generated by default. Users can override this setting with \'/jitsi settings\'.'
                }}
            />
            <RadioField
                heading={{
                    id: 'jitsi.use-jwt',
                    message: 'Use JWT Authentication for Jitsi:'
                }}
                labelClass={'radio-inline'}
                options={JITSI_USE_JWT_OPTIONS}
                onChange={props.onJitsiJwtAuthChange}
                description={{
                    id: 'jitsi.use-jwt-description',
                    message: '(Optional) If your Jitsi server uses JSON Web Tokens (JWT) for authentication, set this value to true.'
                }}
            />
            <InputField
                heading={{
                    id: 'jitsi.app-id',
                    message: 'App ID for JWT Authentication:'
                }}
                tagType={'input'}
                input={{
                    type: 'input',
                    maxLength: -1,
                    onChange: props.onJitsiAppIDChange,
                    value: props.appID
                }}
                description={{
                    id: 'jitsi.app-id-description',
                    message: '(Optional) The app ID used for authentication by the Jitsi server and JWT token generator.'
                }}
            />
            <InputField
                heading={{
                    id: 'jitsi.app-secret',
                    message: 'App Secret for JWT Authentication:'
                }}
                tagType={'input'}
                input={{
                    type: 'input',
                    maxLength: -1,
                    onChange: props.onJitsiAppSecretChange,
                    value: props.appSecret
                }}
                description={{
                    id: 'jitsi.app-secret-description',
                    message: '(Optional) The app secret used for authentication by the Jitsi server and JWT token generator.'
                }}
            />
            <InputField
                heading={{
                    id: 'jitsi.link-expiry-time',
                    message: 'Meeting Link Expiry Time (minutes):'
                }}
                tagType={'input'}
                input={{
                    type: 'number',
                    min: 1,
                    defaultValue: 30,
                    onChange: props.onJitsiMeetingLinkExpChange,
                    value: props.meetingLinkExpire
                }}
                description={{
                    id: 'jitsi.link-expiry-time-description',
                    message: '(Optional) The number of minutes from when the meeting link is created to when it becomes invalid. Minimum is 1 minute. Only applies if using JWT authentication for your Jitsi server.'
                }}
            />
            <RadioField
                heading={{
                    id: 'jitsi.enable-compatibility-mode',
                    message: 'Enable Compatibility Mode:'
                }}
                labelClass={'radio-inline'}
                options={JITSI_COMPATIBILITY_OPTIONS}
                onChange={props.onJitsiCompatibilityChange}
                description={{
                    id: 'jitsi.enable-compatibility-mode-description',
                    message: '(Insecure) If your Jitsi server is not compatible with this plugin, include the JavaScript API hosted on your Jitsi server directly in Mattermost instead of the default API version provided by the plugin. WARNING: Enabling this setting can compromise the security of your Mattermost system, if your Jitsi server is not fully trusted and allows direct modification of program files. Use with caution.'
                }}
            />
        </div>
    );
};

export default JitsiSection;
