// PIN verification abstraction.
// MVP: plain comparison. Replace with bcrypt/argon2 later without touching callers.

export function hashPin(plain: string): string {
  // Placeholder. Swap to bcrypt/argon2 hash when moving past MVP.
  return plain;
}

export function verifyPin(stored: string, provided: string): boolean {
  // Constant-time-ish comparison even for plain strings, to avoid trivial timing leaks.
  if (stored.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < stored.length; i++) {
    diff |= stored.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}
