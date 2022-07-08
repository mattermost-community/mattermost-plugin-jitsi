import React, {useCallback, useEffect, useState, useMemo, ChangeEvent} from 'react';
import {FormattedMessage} from 'react-intl';
import {AdminConfig} from 'mattermost-redux/types/config';

import {id as pluginId} from 'manifest';
import I18nProvider from 'components/i18n_provider';
import JaaSSection from './jaas_section';
import JitsiSection, {JITSI_NAMING_SCHEME} from './jitsi_section';

type Props = {
    id: string,
    label: string,
    value: Settings,
    disabled: boolean,
    config: AdminConfig,
    license: object,
    setByEnv: boolean,
    onChange: Function,
    registerSaveAction: Function,
    setSaveNeeded: Function,
    unRegisterSaveAction: Function
};

type Settings = {
    usejaas?: boolean,
    jitsiurl?: string,
    jitsiembedded?: boolean,
    jitsinamingscheme?: string,
    jitsijwt?: boolean,
    jitsiappid?: string,
    jitsiappsecret?: string,
    jitsilinkvalidtime?: number,
    jitsicompatibilitymode?: boolean,
    jaasappid?: string,
    jaasapikey?: string,
    jaasprivatekey?: string
};

const JITSI_MODE = 'JITSI_MODE';
const JAAS_MODE = 'JAAS_MODE';

const DEFAULT_JITSI_URL = 'https://meet.jit.si';
const JITSI_LINK_VALID_TIME = 30;
const DEFAULT_SETTINGS: Settings = {
    usejaas: false,
    jitsiurl: DEFAULT_JITSI_URL,
    jitsiembedded: false,
    jitsinamingscheme: JITSI_NAMING_SCHEME.WORDS,
    jitsijwt: false,
    jitsiappid: '',
    jitsiappsecret: '',
    jitsilinkvalidtime: JITSI_LINK_VALID_TIME,
    jitsicompatibilitymode: false,
    jaasappid: '',
    jaasapikey: '',
    jaasprivatekey: ''
};

const JitsiSettings = ({id, value, disabled, config, onChange, setSaveNeeded}: Props) => {
    const selectedMode = value?.usejaas ? JAAS_MODE : JITSI_MODE;

    let selectedSettings = DEFAULT_SETTINGS;
    selectedSettings = useMemo(() => ({
        jitsiurl: config.PluginSettings.Plugins[pluginId].jitsiurl ?? DEFAULT_SETTINGS.jitsiurl,
        jitsiappsecret: config.PluginSettings.Plugins[pluginId].jitsiappsecret ?? DEFAULT_SETTINGS.jitsiappsecret,
        jitsiappid: config.PluginSettings.Plugins[pluginId].jitsiappid ?? DEFAULT_SETTINGS.jaasappid,
        jitsicompatibilitymode: config.PluginSettings.Plugins[pluginId].jitsicompatibilitymode ?? DEFAULT_SETTINGS.jitsicompatibilitymode,
        jitsiembedded: config.PluginSettings.Plugins[pluginId].jitsiembedded ?? DEFAULT_SETTINGS.jitsiembedded,
        jitsijwt: config.PluginSettings.Plugins[pluginId].jitsijwt ?? DEFAULT_SETTINGS.jitsijwt,
        jitsilinkvalidtime: config.PluginSettings.Plugins[pluginId].jitsilinkvalidtime ?? DEFAULT_SETTINGS.jitsilinkvalidtime,
        jitsinamingscheme: config.PluginSettings.Plugins[pluginId].jitsinamingscheme ?? DEFAULT_SETTINGS.jitsinamingscheme,
        usejaas: DEFAULT_SETTINGS.usejaas,
        jaasappid: DEFAULT_SETTINGS.jaasappid,
        jaasapikey: DEFAULT_SETTINGS.jaasapikey,
        jaasprivatekey: DEFAULT_SETTINGS.jaasprivatekey
    }), [config]);

    const [settings, setSettings] = useState(value ?? selectedSettings);
    const [mode, setMode] = useState(selectedMode);

    useEffect(() => {
        onChange(id, settings);
        setSaveNeeded();
    }, [settings]);

    const onModeSelected = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            usejaas: e.target.value === JAAS_MODE
        });
        setMode(e.target.value);
    }, [settings]);

    const updateSettingsState = useCallback((key: string, newValue: string | boolean) => {
        setSettings({
            ...settings,
            [key]: newValue
        });
    }, [settings]);

    const onJaaSApiKeyChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jaasapikey', e.target.value);
    }, []);

    const onJaaSAppIDChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jaasappid', e.target.value);
    }, []);

    const onJaaSPrivateKeyChanged = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        updateSettingsState('jaasprivatekey', e.target.value);
    }, []);

    // We reuse some of the Jitsi settings for JaaS
    const onJaaSEmbeddedChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiembedded', e.target.value === 'true');
    }, []);

    const onJaaSCompatibilityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsicompatibilitymode', e.target.value === 'true');
    }, []);

    const onJitsiAppIDChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiappid', e.target.value);
    }, []);

    const onJitsiAppSecretChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiappsecret', e.target.value);
    }, []);

    const onJitsiCompatibilityChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsicompatibilitymode', e.target.value === 'true');
    }, []);

    const onJitsiEmbeddedChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiembedded', e.target.value === 'true');
    }, []);

    const onJitsiAuthChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsijwt', e.target.value === 'true');
    }, []);

    const onJitsiMeetingLinkExpChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsilinkvalidtime', e.target.value);
    }, []);

    const onJitsiMeetingNamesChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsinamingscheme', e.target.value);
    }, []);

    const onJitsiURLChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiurl', e.target.value);
    }, []);

    const jitsiSection = useMemo(() => (
        <JitsiSection
            disabled={disabled}
            onJitsiAppIDChange={onJitsiAppIDChanged}
            onJitsiAppSecretChange={onJitsiAppSecretChanged}
            onJitsiCompatibilityChange={onJitsiCompatibilityChanged}
            onJitsiEmbeddedChange={onJitsiEmbeddedChanged}
            onJitsiJwtAuthChange={onJitsiAuthChanged}
            onJitsiMeetingLinkExpChange={onJitsiMeetingLinkExpChanged}
            onJitsiMeetingNamesChange={onJitsiMeetingNamesChanged}
            onJitsiURLChange={onJitsiURLChanged}
            serverUrl={settings.jitsiurl ?? ''}
            embedded={settings.jitsiembedded ?? false}
            namingScheme={settings.jitsinamingscheme ?? JITSI_NAMING_SCHEME.WORDS}
            jwtEnabled={settings.jitsijwt ?? false}
            appID={settings.jitsiappid ?? ''}
            appSecret={settings.jitsiappsecret ?? ''}
            meetingLinkExpire={settings.jitsilinkvalidtime ?? JITSI_LINK_VALID_TIME}
            compatibilityMode={settings.jitsicompatibilitymode ?? false}
        />
    ), [disabled, settings]);

    const jaasSection = useMemo(() => (
        <JaaSSection
            disabled={disabled}
            onApiKeyIDChange={onJaaSApiKeyChanged}
            onAppIDChange={onJaaSAppIDChanged}
            onPrivateKeyChange={onJaaSPrivateKeyChanged}
            onEmbeddedChange={onJaaSEmbeddedChanged}
            onCompatibilityChange={onJaaSCompatibilityChange}
            appID={settings.jaasappid ?? ''}
            apiKey={settings.jaasapikey ?? ''}
            privateKey={settings.jaasprivatekey ?? ''}
            embedded={settings.jitsiembedded ?? false}
            compatibilityMode={settings.jitsicompatibilitymode ?? false}
        />
    ), [settings, disabled]);

    return (
        <I18nProvider>
            <div>
                <div className='form-group'>
                    <label className='col-sm-4'>
                        <FormattedMessage
                            id='jitsi.server'
                            defaultMessage={'Server:'}
                        />
                    </label>
                    <div className='col-sm-8'>
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                checked={mode === JITSI_MODE}
                                onChange={onModeSelected}
                                value={JITSI_MODE}
                            />
                            <FormattedMessage
                                id='jitsi.input-enable-jitsi'
                                defaultMessage='Jitsi'
                            />
                        </label>
                        <label className='radio-inline pt-0'>
                            <input
                                type='radio'
                                checked={mode === JAAS_MODE}
                                onChange={onModeSelected}
                                value={JAAS_MODE}
                            />
                            <FormattedMessage
                                id='jitsi.input-enable-jass'
                                defaultMessage='JasS'
                            />
                        </label>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id='jitsi.server-description'
                                    defaultMessage={'Select the type of jitsi server you want to use.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <hr style={{height: '3px'}}/>
                {mode === JAAS_MODE ? jaasSection : jitsiSection}
            </div>
        </I18nProvider>
    );
};

export default JitsiSettings;
