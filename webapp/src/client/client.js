import request from 'superagent';

export default class Client {
    constructor() {
        if (window.basename) {
            this.url = window.basename + '/plugins/jitsi';
        } else {
            this.url = '/plugins/jitsi';
        }
    }

    startMeeting = async (channelId, personal = false, topic = '', meetingId = 0) => {
        return this.doPost(`${this.url}/api/v1/meetings`, {channel_id: channelId, personal, topic, meeting_id: meetingId});
    }

    doPost = async (url, body, headers = {}) => {
        headers['X-Requested-With'] = 'XMLHttpRequest';

        try {
            const response = await request.
                post(url).
                send(body).
                set(headers).
                type('application/json').
                accept('application/json');

            return response.body;
        } catch (err) {
            throw err;
        }
    }
}
