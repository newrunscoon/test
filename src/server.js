import http from 'node:http';
import { handleLogin } from './auth.js';

/** @type {number} 기본 서버 포트 */
const DEFAULT_PORT = 3000;

/**
 * HTTP 요청 본문을 JSON으로 파싱한다.
 * @param {import('node:http').IncomingMessage} req - HTTP 요청
 * @returns {Promise<unknown>} 파싱된 JSON 객체
 */
function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalLength = 0;
        const maxBodySize = 1024;

        req.on('data', (chunk) => {
            totalLength += chunk.length;
            if (totalLength > maxBodySize) {
                reject(new Error('요청 본문이 너무 큽니다.'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });

        req.on('end', () => {
            if (chunks.length === 0) {
                resolve(null);
                return;
            }

            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            } catch {
                reject(new Error('JSON 파싱에 실패했습니다.'));
            }
        });

        req.on('error', reject);
    });
}

/**
 * JSON 응답을 전송한다.
 * @param {import('node:http').ServerResponse} res - HTTP 응답
 * @param {number} status - 상태 코드
 * @param {object} body - 응답 본문
 */
function sendJson(res, status, body) {
    const payload = JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
}

/**
 * HTTP 서버를 생성한다.
 * @returns {import('node:http').Server} HTTP 서버 인스턴스
 */
function createAppServer() {
    return http.createServer(async (req, res) => {
        if (req.method === 'POST' && req.url === '/api/login') {
            try {
                const body = await readJsonBody(req);
                const result = handleLogin(body);
                sendJson(res, result.status, result.body);
            } catch {
                sendJson(res, 400, { error: '유효하지 않은 요청입니다.' });
            }
            return;
        }

        sendJson(res, 404, { error: '찾을 수 없습니다.' });
    });
}

/**
 * HTTP 서버를 시작한다.
 * @param {number} [port=DEFAULT_PORT] - 리슨 포트
 * @returns {import('node:http').Server} 시작된 서버
 */
function startServer(port = DEFAULT_PORT) {
    const server = createAppServer();

    server.listen(port, () => {
        console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });

    return server;
}

export { createAppServer, startServer, readJsonBody, DEFAULT_PORT };
