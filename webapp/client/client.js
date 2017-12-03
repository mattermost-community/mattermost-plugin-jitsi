import request from 'superagent';

/* Add web utilities for interacting with servers here */

export default class Client {
    constructor() {
        /* Define any class variables here */
        this.url = 'http://example.com';
    }

    exampleRequest = async () => {
        return this.doGet(`${this.url}/example`);
    }

    doGet = async (url, headers = {}) => {
        try {
            const response = await request.
                get(url).
                set(headers).
                type('application/json').
                accept('application/json');

            return response.body;
        } catch (err) {
            throw err;
        }
    }
}
