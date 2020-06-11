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
