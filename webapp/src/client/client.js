import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';

import {id} from '../manifest';

export default class Client {
    constructor() {
        if (window.basename) {
            this.url = window.basename + '/plugins/' + id;
        } else {
            this.url = '/plugins/' + id;
        }
    }

    startMeeting = async (channelId, personal = false, topic = '', meetingId = 0) => {
        return this.doPost(`${this.url}/api/v1/meetings`, {channel_id: channelId, personal, topic, meeting_id: meetingId});
    }

    enrichMeetingJwt = async (meetingJwt) => {
        return this.doPost(`${this.url}/api/v1/meetings/enrich`, {jwt: meetingJwt});
    }

    doPost = async (url, body, headers = {}) => {
        const options = {
            method: 'post',
            body: JSON.stringify(body),
            headers
        };

        const response = await fetch(url, Client4.getOptions(options));

        if (response.ok) {
            return response.json();
        }

        const text = await response.text();

        throw new ClientError(Client4.url, {
            message: text || '',
            status_code: response.status,
            url
        });
    }
}
