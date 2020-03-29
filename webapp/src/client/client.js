//import request from 'superagent';
import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';

export default class Client {
    constructor() {
        this.url = '/plugins/jitsi';
    }

    startMeeting = async (channelId, personal = false, topic = '', meetingId = 0) => {
        return this.doPost(`${this.url}/api/v1/meetings`, {channel_id: channelId, personal, topic, meeting_id: meetingId});
    }

    requestJWT = async (channelId, meetingId, meetingOwnerId = '', displayName = '') => {
        return this.doPost(`${this.url}/api/v1/meetings/gentoken`, {channel_id: channelId, meeting_id: meetingId, owner_id: meetingOwnerId, display_name: displayName});
    }

    doPost = async (url, body, headers = {}) => {
        //headers['X-Timezone-Offset'] = new Date().getTimezoneOffset();
        headers['X-Requested-With'] = 'XMLHttpRequest';

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
