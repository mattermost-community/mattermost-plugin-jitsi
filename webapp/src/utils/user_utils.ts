import {getFullName} from 'mattermost-redux/utils/user_utils';
import {UserProfile} from 'mattermost-redux/types/users';

import {Config} from '../types';

export function displayUsernameForUser(user: UserProfile | null, config: Config): string {
    if (user) {
        const nameFormat = config.TeammateNameDisplay;
        let name = user.username;
        if (nameFormat === 'nickname_full_name' && user.nickname && user.nickname !== '') {
            name = user.nickname;
        } else if ((user.first_name || user.last_name) && (nameFormat === 'nickname_full_name' || nameFormat === 'full_name')) {
            name = getFullName(user);
        }

        return name;
    }

    return '';
}
