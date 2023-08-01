import { createHash } from 'node:crypto';

const EXPIRY = 2 * 24 * 60 * 60 * 1000; // session will expire if inactive for this long

export function sha(string: string) {
    return createHash('sha256').update(string).digest('hex');
}

export function sessionExpired(setAt: string) {
    return +setAt + EXPIRY < Date.now()
}