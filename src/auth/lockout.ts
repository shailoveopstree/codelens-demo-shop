import { db, type User } from "../lib/db.js";

/**
 * Consecutive failed logins that lock an account. Overridable per environment
 * via LOCKOUT_MAX so ops can tighten it without a deploy.
 */
export function lockoutThreshold(): number {
  return Number(process.env.LOCKOUT_MAX ?? 5);
}

export function isLockedOut(user: User): boolean {
  return user.failedLogins >= lockoutThreshold();
}

export function recordFailure(user: User): void {
  user.failedLogins += 1;
  db.users.set(user.id, user);
}

export function resetFailures(user: User): void {
  if (user.failedLogins === 0) return;
  user.failedLogins = 0;
  db.users.set(user.id, user);
}
