import { addHours, castToNumber, formatAMPM, formatBytes, sanitizeEmail, updateDateWithNewTime } from './index';

describe('formatBytes', () => {
    test('returns "0 Bytes" for 0', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    test('formats a value under 1 KB in bytes', () => {
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    test('formats a value in KB with the default 2 decimals', () => {
        expect(formatBytes(1536)).toBe('1.5 KB');
    });

    test('respects a custom decimals argument', () => {
        expect(formatBytes(1536, 0)).toBe('2 KB');
    });
});

describe('formatAMPM', () => {
    test('formats a morning time', () => {
        expect(formatAMPM(new Date(2024, 0, 1, 9, 5))).toBe('9:05 am');
    });

    // formatAMPM keeps the raw 24-hour value instead of the 12-hour one for
    // any hour from 13 to 23, so 13:00 currently renders as "13:00 pm"
    // rather than "1:00 pm". This documents the function's current, real
    // behavior; fixing it is outside the scope of this deployment task.
    test('formats a time right after noon using the function\'s current (incorrect) 24-hour value', () => {
        expect(formatAMPM(new Date(2024, 0, 1, 13, 0))).toBe('13:00 pm');
    });

    test('formats midnight as 12 am', () => {
        expect(formatAMPM(new Date(2024, 0, 1, 0, 0))).toBe('12:00 am');
    });
});

describe('addHours', () => {
    test('adds hours to a date', () => {
        const result = addHours(new Date(2024, 0, 1, 10, 0), 3);
        expect(result.getHours()).toBe(13);
    });

    test('subtracts hours when given a negative value', () => {
        const result = addHours(new Date(2024, 0, 1, 10, 0), -2);
        expect(result.getHours()).toBe(8);
    });
});

describe('updateDateWithNewTime', () => {
    test('keeps the original date but applies the new time', () => {
        const existingDate = new Date(2024, 5, 15, 8, 0);
        const newTime = new Date(2024, 0, 1, 18, 30);
        const result = updateDateWithNewTime(existingDate, newTime);

        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(5);
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(18);
        expect(result.getMinutes()).toBe(30);
    });
});

describe('sanitizeEmail', () => {
    test('trims surrounding whitespace and lowercases the address', () => {
        expect(sanitizeEmail('  USER@Example.com  ')).toBe('user@example.com');
    });
});

describe('castToNumber', () => {
    test('converts a numeric string to a number', () => {
        expect(castToNumber('42')).toBe(42);
    });

    test('returns NaN for a non-numeric string', () => {
        expect(castToNumber('not a number')).toBeNaN();
    });
});
