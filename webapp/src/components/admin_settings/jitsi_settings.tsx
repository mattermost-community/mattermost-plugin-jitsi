import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import JaaSSection from './jaas_section';
import JitsiSection, {JITSI_NAMING_SCHEME} from './jitsi_section';
import {id as pluginId} from '../../manifest';
import I18nProvider from 'components/i18n_provider';
import {AdminConfig} from 'mattermost-redux/types/config';

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
const JITSI_LINK_VALID_TIME = 30; // TODO set default value
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

const JitsiSettings = (props: Props) => {
    // Check previous setting setup in case of upgrade
    const selectedMode = props.value?.usejaas ? JAAS_MODE : JITSI_MODE;

    let selectedSettings = DEFAULT_SETTINGS;
    if (!props.value) {
        selectedSettings = {
            jitsiurl: props.config.PluginSettings.Plugins[pluginId].jitsiurl ?? DEFAULT_SETTINGS.jitsiurl,
            jitsiappsecret: props.config.PluginSettings.Plugins[pluginId].jitsiappsecret ?? DEFAULT_SETTINGS.jitsiappsecret,
            jitsiappid: props.config.PluginSettings.Plugins[pluginId].jitsiappid ?? DEFAULT_SETTINGS.jaasappid,
            jitsicompatibilitymode: props.config.PluginSettings.Plugins[pluginId].jitsicompatibilitymode ?? DEFAULT_SETTINGS.jitsicompatibilitymode,
            jitsiembedded: props.config.PluginSettings.Plugins[pluginId].jitsiembedded ?? DEFAULT_SETTINGS.jitsiembedded,
            jitsijwt: props.config.PluginSettings.Plugins[pluginId].jitsijwt ?? DEFAULT_SETTINGS.jitsijwt,
            jitsilinkvalidtime: props.config.PluginSettings.Plugins[pluginId].jitsilinkvalidtime ?? DEFAULT_SETTINGS.jitsilinkvalidtime,
            jitsinamingscheme: props.config.PluginSettings.Plugins[pluginId].jitsinamingscheme ?? DEFAULT_SETTINGS.jitsinamingscheme,
            usejaas: DEFAULT_SETTINGS.usejaas,
            jaasappid: DEFAULT_SETTINGS.jaasappid,
            jaasapikey: DEFAULT_SETTINGS.jaasapikey,
            jaasprivatekey: DEFAULT_SETTINGS.jaasprivatekey
        };
    }

    const [value, setValue] = React.useState(props.value ?? selectedSettings);
    const [mode, setMode] = React.useState(selectedMode);

    React.useEffect(() => {
        props.onChange(props.id, value);
        props.setSaveNeeded();
    }, [value]);

    const onModeSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMode = e.target.value;
        setValue({
            ...value,
            usejaas: newMode === JAAS_MODE
        });
        setMode(newMode);
    };

    const updateSettingsState = (key: string, newValue: string | boolean) => {
        setValue({
            ...value,
            [key]: newValue
        });
    };

    const onJaaSApiKeyChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jaasapikey', e.target.value);
    };

    const onJaaSAppIDChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jaasappid', e.target.value);
    };

    const onJaaSPrivateKeyChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSettingsState('jaasprivatekey', e.target.value);
    };

    // We reuse some of the Jitsi settings for JaaS
    const onJaaSEmbeddedChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiembedded', e.target.value === 'true');
    };

    const onJaaSCompatibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsicompatibilitymode', e.target.value === 'true');
    };

    const onJitsiAppIDChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiappid', e.target.value);
    };

    const onJitsiAppSecretChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiappsecret', e.target.value);
    };

    const onJitsiCompatibilityChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsicompatibilitymode', e.target.value === 'true');
    };

    const onJitsiEmbeddedChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiembedded', e.target.value === 'true');
    };

    const onJitsiAuthChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsijwt', e.target.value === 'true');
    };

    const onJitsiMeetingLinkExpChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsilinkvalidtime', e.target.value);
    };

    const onJitsiMeetingNamesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsinamingscheme', e.target.value);
    };

    const onJitsiURLChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSettingsState('jitsiurl', e.target.value);
    };

    const renderJitsiSettings = () => {
        return (
            <JitsiSection
                disabled={props.disabled}
                onJitsiAppIDChange={onJitsiAppIDChanged}
                onJitsiAppSecretChange={onJitsiAppSecretChanged}
                onJitsiCompatibilityChange={onJitsiCompatibilityChanged}
                onJitsiEmbeddedChange={onJitsiEmbeddedChanged}
                onJitsiJwtAuthChange={onJitsiAuthChanged}
                onJitsiMeetingLinkExpChange={onJitsiMeetingLinkExpChanged}
                onJitsiMeetingNamesChange={onJitsiMeetingNamesChanged}
                onJitsiURLChange={onJitsiURLChanged}
                serverUrl={value.jitsiurl ?? ''}
                embedded={value.jitsiembedded ?? false}
                namingScheme={value.jitsinamingscheme ?? JITSI_NAMING_SCHEME.WORDS}
                jwtEnabled={value.jitsijwt ?? false}
                appID={value.jitsiappid ?? ''}
                appSecret={value.jitsiappsecret ?? ''}
                meetingLinkExpire={value.jitsilinkvalidtime ?? JITSI_LINK_VALID_TIME}
                compatibilityMode={value.jitsicompatibilitymode ?? false}
            />
        );
    };

    const renderJaaSSettings = () => {
        return (
            <JaaSSection
                disabled={props.disabled}
                onApiKeyIDChange={onJaaSApiKeyChanged}
                onAppIDChange={onJaaSAppIDChanged}
                onPrivateKeyChange={onJaaSPrivateKeyChanged}
                onEmbeddedChange={onJaaSEmbeddedChanged}
                onCompatibilityChange={onJaaSCompatibilityChange}
                appID={value.jaasappid ?? ''}
                apiKey={value.jaasapikey ?? ''}
                privateKey={value.jaasprivatekey ?? ''}
                embedded={value.jitsiembedded ?? false}
                compatibilityMode={value.jitsicompatibilitymode ?? false}
            />
        );
    };

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
                                    id='jitsi.serever-description'
                                    defaultMessage={'Select the type of jitsi server you want to use.'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <hr style={{height: '3px'}}/>
                {
                    mode === JAAS_MODE ?
                        renderJaaSSettings() :
                        renderJitsiSettings()
                }
            </div>
        </I18nProvider>
    );
};

export default JitsiSettings;
