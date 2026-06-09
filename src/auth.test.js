import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {
    parseLoginRequest,
    authenticate,
    createToken,
    handleLogin,
} from './auth.js';
import { createAppServer } from './server.js';

const TEST_SECRET = 'test-jwt-secret-for-unit-tests';

before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
});

after(() => {
    delete process.env.JWT_SECRET;
});

test('parseLoginRequest는 유효한 이메일·비밀번호를 허용한다', () => {
    const result = parseLoginRequest({
        email: 'demo@example.com',
        password: 'password123',
    });
    assert.deepEqual(result, {
        email: 'demo@example.com',
        password: 'password123',
    });
});

test('parseLoginRequest는 잘못된 이메일을 거부한다', () => {
    assert.equal(parseLoginRequest({ email: 'bad', password: 'password123' }), null);
});

test('parseLoginRequest는 빈 비밀번호를 거부한다', () => {
    assert.equal(parseLoginRequest({ email: 'demo@example.com', password: '' }), null);
});

test('authenticate는 올바른 자격 증명을 승인한다', () => {
    const user = authenticate('demo@example.com', 'password123');
    assert.deepEqual(user, { id: '1', email: 'demo@example.com' });
});

test('authenticate는 잘못된 비밀번호를 거부한다', () => {
    assert.equal(authenticate('demo@example.com', 'wrong'), null);
});

test('authenticate는 존재하지 않는 사용자를 거부한다', () => {
    assert.equal(authenticate('unknown@example.com', 'password123'), null);
});

test('createToken은 서명된 토큰 문자열을 반환한다', () => {
    const token = createToken({ id: '1', email: 'demo@example.com' });
    assert.match(token, /^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/);
});

test('handleLogin은 성공 시 토큰을 반환한다', () => {
    const result = handleLogin({
        email: 'demo@example.com',
        password: 'password123',
    });
    assert.equal(result.status, 200);
    assert.equal(typeof result.body.token, 'string');
    assert.equal(result.body.expiresIn, 3600);
});

test('handleLogin은 실패 시 401을 반환한다', () => {
    const result = handleLogin({
        email: 'demo@example.com',
        password: 'wrong',
    });
    assert.equal(result.status, 401);
});

test('POST /api/login 엔드포인트가 동작한다', async () => {
    const server = createAppServer();

    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();

    try {
        const response = await fetch(`http://127.0.0.1:${port}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'demo@example.com',
                password: 'password123',
            }),
        });

        assert.equal(response.status, 200);
        const data = await response.json();
        assert.equal(typeof data.token, 'string');
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});
