import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractEmails, isValidEmail, getValidEmails } from './email.js';
import { partitionValid } from '../Docs/validator.js';

test('extractEmails returns emails from user array', () => {
    const users = [
        { email: 'a@example.com' },
        { email: 'b@example.com' },
    ];
    assert.deepEqual(extractEmails(users), ['a@example.com', 'b@example.com']);
});

test('extractEmails returns empty array for non-array input', () => {
    assert.deepEqual(extractEmails(null), []);
    assert.deepEqual(extractEmails(undefined), []);
});

test('isValidEmail accepts valid addresses', () => {
    assert.equal(isValidEmail('user@example.com'), true);
    assert.equal(isValidEmail('user+tag@example.com'), true);
});

test('isValidEmail rejects invalid addresses', () => {
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail(null), false);
    assert.equal(isValidEmail('user@'), false);
});

test('getValidEmails returns only valid emails', () => {
    const users = [
        { email: 'good@example.com' },
        { email: 'bad' },
        { email: 'also-good@test.org' },
        { email: '' },
    ];
    assert.deepEqual(getValidEmails(users), ['good@example.com', 'also-good@test.org']);
});

test('getValidEmails returns empty array for non-array input', () => {
    assert.deepEqual(getValidEmails(null), []);
});

test('partitionValid splits items into valid and invalid groups', () => {
    const emails = ['good@example.com', 'bad', 'also-good@test.org', ''];
    const result = partitionValid(emails, isValidEmail);
    assert.deepEqual(result.valid, ['good@example.com', 'also-good@test.org']);
    assert.deepEqual(result.invalid, ['bad', '']);
});

test('partitionValid returns empty groups for non-array input', () => {
    assert.deepEqual(partitionValid(null, isValidEmail), { valid: [], invalid: [] });
});
