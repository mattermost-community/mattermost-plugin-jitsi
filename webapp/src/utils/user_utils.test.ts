import {describe, expect, it} from '@jest/globals';

import {UserProfile} from 'mattermost-redux/types/users';

import {displayUsernameForUser} from './user_utils';

describe('displayUsernameForUser', () => {
    const defaultConfig = {
        TeammateNameDisplay: 'nickname_full_name'
    };

    const user: UserProfile = {
        id: 'test',
        create_at: 0,
        update_at: 0,
        delete_at: 0,
        auth_data: '',
        auth_service: '',
        email: '',
        position: '',
        roles: '',
        locale: '',
        notify_props: {
            desktop: 'all',
            desktop_sound: 'true',
            email: 'true',
            mark_unread: 'all',
            push: 'all',
            push_status: 'online',
            comments: 'any',
            first_name: 'true',
            channel: 'true',
            mention_keys: ''
        },
        email_verified: true,
        terms_of_service_id: '',
        terms_of_service_create_at: 0,
        is_bot: false,
        last_picture_update: 0,
        username: 'test-username',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
        nickname: 'test-nickname'
    };

    it('should return and empty string is there is no user', () => {
        expect(displayUsernameForUser(null, defaultConfig)).toBe('');
    });

    it('should return the username if no config is passed', () => {
        expect(displayUsernameForUser(user, {})).toBe(user.username);
    });

    it('should return the nickname if nickname_full_name config is passed and there is a nickname', () => {
        expect(displayUsernameForUser(user, {TeammateNameDisplay: 'nickname_full_name'})).toBe(user.nickname);
    });

    it('should return the full name if nickname_full_name config is passed and there is not a nickname', () => {
        expect(displayUsernameForUser({...user, nickname: ''}, {TeammateNameDisplay: 'nickname_full_name'})).toBe(`${user.first_name} ${user.last_name}`);
    });

    it('should return the username if nickname_full_name config is passed and there is not a nickname, first_name or last_name', () => {
        expect(displayUsernameForUser({...user, nickname: '', first_name: '', last_name: ''}, {TeammateNameDisplay: 'nickname_full_name'})).toBe(user.username);
    });

    it('should return the full name if nickname_full_name config is passed and there is not a nickname', () => {
        expect(displayUsernameForUser({...user, nickname: ''}, {TeammateNameDisplay: 'nickname_full_name'})).toBe(`${user.first_name} ${user.last_name}`);
    });

    it('should return the username if nickname_full_name config is passed and there is not a nickname, first_name or last_name', () => {
        expect(displayUsernameForUser({...user, nickname: '', first_name: '', last_name: ''}, {TeammateNameDisplay: 'nickname_full_name'})).toBe(user.username);
    });

    it('should return the fullname if full_name config is passed and there is a full_name and a nickname', () => {
        expect(displayUsernameForUser(user, {TeammateNameDisplay: 'full_name'})).toBe(`${user.first_name} ${user.last_name}`);
    });

    it('should return the username if full_name config is passed and there is not a first_name or last_name', () => {
        expect(displayUsernameForUser({...user, first_name: '', last_name: ''}, {TeammateNameDisplay: 'full_name'})).toBe(user.username);
    });
});
