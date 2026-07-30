import { createHash } from "node:crypto";

// Toy hashing — do NOT copy this into anything real.
export function hashPassword(plain: string): string {
  return createHash("sha256").update(`demo-salt:${plain}`).digest("hex");
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}
