import { scryptSync } from 'node:crypto';

/** @type {Buffer} 데모용 고정 솔트 (개발·테스트 전용) */
const DEMO_SALT = Buffer.from('cursor-demo-salt');

/**
 * 비밀번호를 scrypt로 해시한다.
 * @param {string} password - 평문 비밀번호
 * @returns {Buffer} 해시 값
 */
function hashPassword(password) {
    return scryptSync(password, DEMO_SALT, 64);
}

/**
 * 데모용 사용자 목록을 반환한다.
 * @returns {Array<{ id: string, email: string, passwordHash: Buffer }>}
 */
function getDemoUsers() {
    return [
        {
            id: '1',
            email: 'demo@example.com',
            passwordHash: hashPassword('password123'),
        },
    ];
}

export { hashPassword, getDemoUsers };
