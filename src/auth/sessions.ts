import { db, type Session } from "../lib/db.js";
import { newId } from "../lib/ids.js";
import { log } from "../lib/logger.js";

const TTL_MS = 60 * 60 * 1000; // 1h

/** Create a session for a user. */
export function createSession(userId: string): Session {
  const now = Date.now();
  const session: Session = {
    token: newId("sess"),
    userId,
    createdAt: now,
    expiresAt: now + TTL_MS,
  };
  db.sessions.set(session.token, session);
  log("info", "session created", { userId });
  return session;
}

// Fixed: previously used > which let a session live one tick past expiry.
export function isExpired(session: Session): boolean {
  return Date.now() >= session.expiresAt;
}

export function getSession(token: string): Session | undefined {
  const session = db.sessions.get(token);
  if (!session) return undefined;
  if (isExpired(session)) {
    db.sessions.delete(token);
    return undefined;
  }
  return session;
}

export function revokeSession(token: string): void {
  db.sessions.delete(token);
}

/** Drop every session belonging to a user (e.g. after an admin unlock). */
export function revokeAllForUser(userId: string): number {
  let revoked = 0;
  for (const [token, session] of db.sessions) {
    if (session.userId === userId) {
      db.sessions.delete(token);
      revoked += 1;
    }
  }
  return revoked;
}
