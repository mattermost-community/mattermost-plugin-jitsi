import {describe, expect, it} from '@jest/globals';

import {formatDate} from './date_utils';

describe('formatDate', () => {
    const sampleDate = new Date(2020, 5, 29, 15, 32, 0);

    it('should return a valid formated date with military time', () => {
        expect(formatDate(sampleDate, true)).toBe('Jun 29 at 15:32');
    });

    it('should return a valid formated date without military time', () => {
        expect(formatDate(sampleDate, false)).toBe('Jun 29 at 3:32 PM');
    });
});
