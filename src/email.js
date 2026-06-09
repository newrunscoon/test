import { filterValid } from '../Docs/validator.js';

// RFC 5322 compliant pattern (emailregex.com / RFC 5322 Official Standard)
const RFC5322_EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

/**
 * 사용자 배열에서 이메일 주소만 추출한다.
 * @param {Array<{ email?: string }>} users - 사용자 객체 배열
 * @returns {string[]} 이메일 주소 배열
 */
function extractEmails(users) {
    if (!Array.isArray(users)) {
        return [];
    }
    return users.map(user => user.email);
}

/**
 * 이메일 주소가 RFC 5322 형식인지 검증한다.
 * @param {unknown} email - 검증할 이메일 주소
 * @returns {boolean} 유효하면 true
 */
function isValidEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
    return RFC5322_EMAIL_REGEX.test(email);
}

/**
 * 사용자 배열에서 유효한 이메일만 반환한다.
 * @param {Array<{ email?: string }>} users - 사용자 객체 배열
 * @returns {string[]} 유효한 이메일 주소 배열
 */
function getValidEmails(users) {
    return filterValid(extractEmails(users), isValidEmail);
}

export { extractEmails, isValidEmail, getValidEmails };
