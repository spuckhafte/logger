import { createHash } from 'node:crypto';
const EXPIRY = 2 * 24 * 60 * 60 * 1000;
export function sha(string) {
    return createHash('sha256').update(string).digest('hex');
}
export function sessionExpired(setAt) {
    return +setAt + EXPIRY < Date.now();
}
