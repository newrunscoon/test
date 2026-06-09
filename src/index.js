import { fileURLToPath } from 'node:url';
import { getValidEmails } from './email.js';
import { startServer } from './server.js';

export { getValidEmails };
export { startServer } from './server.js';
export { handleLogin } from './auth.js';

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
    startServer();
}
