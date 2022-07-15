import {ReactNode} from 'react';

import {GlobalState as ReduxGlobalState} from 'mattermost-redux/types/store';
import {Post} from 'mattermost-redux/types/posts';

export type Config = {
    TeammateNameDisplay?: string
}

export type GlobalState = ReduxGlobalState & {
    'plugins-jitsi': {
        openMeeting: Post | null,
        openMeetingJwt: string | null,
        config: {
            embedded?: boolean,
            // eslint-disable-next-line camelcase
            naming_scheme?: 'ask' | 'words' | 'mattermost' | 'uuid'
        }
    }
}

export type InputElementType = HTMLInputElement | HTMLTextAreaElement;

export type RadioOptionsType = {
    value: string;
    checked: boolean;
    label: string | ReactNode;
}

export enum InputTypes {
    Text = 'text',
    Number = 'number',
    TextArea = 'textarea',
}
