import { db, type User } from "../lib/db.js";
import { log } from "../lib/logger.js";
import { revokeAllForUser } from "./sessions.js";

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

/**
 * Admin action: clear an account's lockout and force a fresh login by dropping
 * every active session for that user.
 */
export function unlockAccount(userId: string): { unlocked: boolean; sessionsRevoked: number } {
  const user = db.users.get(userId);
  if (!user) return { unlocked: false, sessionsRevoked: 0 };
  user.failedLogins = 0;
  db.users.set(user.id, user);
  const sessionsRevoked = revokeAllForUser(userId);
  log("info", "account unlocked by admin", { userId, sessionsRevoked });
  return { unlocked: true, sessionsRevoked };
}
