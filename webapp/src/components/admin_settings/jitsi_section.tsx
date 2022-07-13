import React, {useMemo} from 'react';
import {FormattedMessage} from 'react-intl';

import {InputFieldType, Types} from 'types';
import {TextInput} from '../InputField';
import {RadioField} from '../RadioField';

type Props = {
    disabled: boolean,
    onJitsiURLChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiEmbeddedChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiMeetingNamesChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiJwtAuthChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiAppIDChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiAppSecretChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiMeetingLinkExpChange: (e: React.ChangeEvent<InputFieldType>) => void,
    onJitsiCompatibilityChange: (e: React.ChangeEvent<InputFieldType>) => void,
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

const JitsiSection = ({onJitsiAppIDChange, onJitsiEmbeddedChange, onJitsiMeetingLinkExpChange, onJitsiMeetingNamesChange, onJitsiJwtAuthChange, onJitsiAppSecretChange, onJitsiCompatibilityChange, onJitsiURLChange, serverUrl, embedded, namingScheme, jwtEnabled, appID, appSecret, meetingLinkExpire, compatibilityMode}: Props) => {
    const EMBED_JITSI_VIDEO_INSIDE_MATTERMOST_OPTIONS = useMemo(() => [
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

    const JITSI_MEETING_NAMES_OPTIONS = useMemo(() => [
        {
            value: JITSI_NAMING_SCHEME.WORDS,
            checked: namingScheme === JITSI_NAMING_SCHEME.WORDS,
            id: 'jitsi.random-english-words',
            message: 'Random English words in title case (e.g. PlayfulDragonsObserveCuriously)'
        },
        {
            value: JITSI_NAMING_SCHEME.UUID,
            checked: namingScheme === JITSI_NAMING_SCHEME.UUID,
            id: 'jitsi.uuid',
            message: 'UUID (universally unique identifier)'
        },
        {
            value: JITSI_NAMING_SCHEME.MATTERMOST,
            checked: namingScheme === JITSI_NAMING_SCHEME.MATTERMOST,
            id: 'jitsi.context-specific',
            message: 'Mattermost context specific names. Combination of team name, channel name, and random text in Public and Private channels; personal meeting name in Direct and Group Message channels.'
        },
        {
            value: JITSI_NAMING_SCHEME.ASK,
            checked: namingScheme === JITSI_NAMING_SCHEME.ASK,
            id: 'jitsi.allow-user',
            message: 'Allow user to select meeting name'
        }
    ], [namingScheme]);

    const JITSI_USE_JWT_OPTIONS = useMemo(() => [
        {
            value: 'true',
            checked: jwtEnabled,
            id: 'jitsi.true',
            message: 'true'
        },
        {
            value: 'false',
            checked: !jwtEnabled,
            id: 'jitsi.false',
            message: 'false'
        }
    ], [jwtEnabled]);

    const JITSI_COMPATIBILITY_OPTIONS = useMemo(() => [
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
            <TextInput
                heading={
                    <FormattedMessage
                        id='jitsi.server-url'
                        defaultMessage={'Jitsi Server URL:'}
                    />
                }
                type={Types.text}
                placeholder={'https://meet.jit.si'}
                onChange={onJitsiURLChange}
                value={serverUrl}
                description={
                    <FormattedMessage
                        id='jitsi.server-url-description'
                        defaultMessage={'The url for your Jitsi server, for example https://jitsi.example.com. Defaults to https://meet.jit.si, which is the public server provided by Jitsi.'}
                    />
                }
            />
            <RadioField
                heading={
                    <FormattedMessage
                        id='jitsi.embed-video'
                        defaultMessage={'Embed Jitsi video inside Mattermost:'}
                    />
                }
                isInline={true}
                options={EMBED_JITSI_VIDEO_INSIDE_MATTERMOST_OPTIONS}
                onChange={onJitsiEmbeddedChange}
                description={
                    <FormattedMessage
                        id='jitsi.embed-video-description'
                        defaultMessage={'(Experimental) When true, Jitsi video is embedded as a floating window inside Mattermost by default. Users can override this setting with \'/jitsi settings\'.'}
                    />
                }
            />
            <RadioField
                heading={
                    <FormattedMessage
                        id='jitsi.meeting-names'
                        defaultMessage={'Jitsi Meeting Names:'}
                    />
                }
                isInline={false}
                options={JITSI_MEETING_NAMES_OPTIONS}
                onChange={onJitsiMeetingNamesChange}
                description={
                    <FormattedMessage
                        id='jitsi.meeting-names-description'
                        defaultMessage={'Select how meeting names are generated by default. Users can override this setting with \'/jitsi settings\'.'}
                    />
                }
            />
            <RadioField
                heading={
                    <FormattedMessage
                        id='jitsi.use-jwt'
                        defaultMessage={'Use JWT Authentication for Jitsi:'}
                    />
                }
                isInline={true}
                options={JITSI_USE_JWT_OPTIONS}
                onChange={onJitsiJwtAuthChange}
                description={
                    <FormattedMessage
                        id='jitsi.use-jwt-description'
                        defaultMessage={'(Optional) If your Jitsi server uses JSON Web Tokens (JWT) for authentication, set this value to true.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jitsi.app-id'
                        defaultMessage={'App ID for JWT Authentication:'}
                    />
                }
                type={Types.text}
                onChange={onJitsiAppIDChange}
                value={appID}
                description={
                    <FormattedMessage
                        id='jitsi.app-id-description'
                        defaultMessage={'(Optional) The app ID used for authentication by the Jitsi server and JWT token generator.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jitsi.app-secret'
                        defaultMessage={'App Secret for JWT Authentication:'}
                    />
                }
                type={Types.text}
                onChange={onJitsiAppSecretChange}
                value={appSecret}
                description={
                    <FormattedMessage
                        id='jitsi.app-secret-description'
                        defaultMessage={'(Optional) The app secret used for authentication by the Jitsi server and JWT token generator.'}
                    />
                }
            />
            <TextInput
                heading={
                    <FormattedMessage
                        id='jitsi.link-expiry-time'
                        defaultMessage={'Meeting Link Expiry Time (minutes):'}
                    />
                }
                type={Types.number}
                min={1}
                defaultValue={30}
                onChange={onJitsiMeetingLinkExpChange}
                value={meetingLinkExpire}
                description={
                    <FormattedMessage
                        id='jitsi.link-expiry-time-description'
                        defaultMessage={'(Optional) The number of minutes from when the meeting link is created to when it becomes invalid. Minimum is 1 minute. Only applies if using JWT authentication for your Jitsi server.'}
                    />
                }
            />
            <RadioField
                heading={
                    <FormattedMessage
                        id='jitsi.enable-compatibility-mode'
                        defaultMessage={'Enable Compatibility Mode:'}
                    />
                }
                isInline={true}
                options={JITSI_COMPATIBILITY_OPTIONS}
                onChange={onJitsiCompatibilityChange}
                description={
                    <FormattedMessage
                        id='jitsi.enable-compatibility-mode-description'
                        defaultMessage={'(Insecure) If your Jitsi server is not compatible with this plugin, include the JavaScript API hosted on your Jitsi server directly in Mattermost instead of the default API version provided by the plugin. WARNING: Enabling this setting can compromise the security of your Mattermost system, if your Jitsi server is not fully trusted and allows direct modification of program files. Use with caution.'}
                    />
                }
            />
        </div>
    );
};

export default JitsiSection;
