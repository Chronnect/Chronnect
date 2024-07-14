import { PgpKey } from './models';

export function isValidPgpKey(key: string): boolean {
    return key.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") &&
        key.endsWith("-----END PGP PUBLIC KEY BLOCK-----");
}

export function isValidPgpKeyResponseObj(obj: any): obj is PgpKey {
    return obj && typeof obj === 'object' &&
        typeof obj.key_status === 'string' &&
        typeof obj.key_type === 'string' &&
        typeof obj.public_key === 'string' &&
        (typeof obj.created_at === 'number' || obj.created_at === null);
}
