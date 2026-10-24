import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const BCRYPT_PREFIX = /^\$2[aby]\$/;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  stored: string
): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (BCRYPT_PREFIX.test(stored)) {
    const ok = await bcrypt.compare(plain, stored);
    return { ok, needsRehash: false };
  }

  // Legacy plaintext accounts — accept once, then rehash on success
  if (plain === stored) {
    return { ok: true, needsRehash: true };
  }

  return { ok: false, needsRehash: false };
}
