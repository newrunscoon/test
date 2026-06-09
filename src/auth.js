import { createHmac, timingSafeEqual } from 'node:crypto';
import { isValidEmail } from './email.js';
import { getDemoUsers, hashPassword } from './users.js';

/** @type {number} 토큰 유효 시간(초) */
const TOKEN_TTL_SECONDS = 3600;

/**
 * JWT 서명에 사용할 비밀키를 환경 변수에서 가져온다.
 * @returns {string} 서명 비밀키
 * @throws {Error} JWT_SECRET이 설정되지 않은 경우
 */
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET 환경 변수가 필요합니다.');
    }
    return secret;
}

/**
 * 로그인 요청 본문을 검증한다.
 * @param {unknown} body - 요청 본문
 * @returns {{ email: string, password: string } | null} 유효하면 파싱 결과, 아니면 null
 */
function parseLoginRequest(body) {
    if (!body || typeof body !== 'object') {
        return null;
    }

    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
    }

    if (!isValidEmail(email) || password.length === 0 || password.length > 128) {
        return null;
    }

    return { email, password };
}

/**
 * 이메일과 비밀번호로 사용자를 인증한다.
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {{ id: string, email: string } | null} 성공 시 사용자 정보, 실패 시 null
 */
function authenticate(email, password) {
    const users = getDemoUsers();
    const user = users.find((u) => u.email === email);
    const inputHash = hashPassword(password);
    const expectedHash = user?.passwordHash ?? hashPassword('__invalid__');

    if (!timingSafeEqual(inputHash, expectedHash) || !user) {
        return null;
    }

    return { id: user.id, email: user.email };
}

/**
 * 로그인 토큰을 생성한다.
 * @param {{ id: string, email: string }} user - 인증된 사용자
 * @returns {string} 서명된 토큰
 */
function createToken(user) {
    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    const payload = `${user.id}:${user.email}:${expiresAt}`;
    const signature = createHmac('sha256', getJwtSecret())
        .update(payload)
        .digest('hex');

    return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

/**
 * 로그인 요청을 처리한다.
 * @param {unknown} body - 요청 본문
 * @returns {{ status: number, body: object }} HTTP 응답
 */
function handleLogin(body) {
    const credentials = parseLoginRequest(body);

    if (!credentials) {
        return {
            status: 400,
            body: { error: '유효하지 않은 요청입니다.' },
        };
    }

    const user = authenticate(credentials.email, credentials.password);

    if (!user) {
        return {
            status: 401,
            body: { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        };
    }

    return {
        status: 200,
        body: {
            token: createToken(user),
            expiresIn: TOKEN_TTL_SECONDS,
        },
    };
}

export {
    parseLoginRequest,
    authenticate,
    createToken,
    handleLogin,
    getJwtSecret,
    TOKEN_TTL_SECONDS,
};
