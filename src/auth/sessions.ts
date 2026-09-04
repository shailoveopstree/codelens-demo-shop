import { db, type Session } from "../lib/db.js";
import { newId } from "../lib/ids.js";
import { log } from "../lib/logger.js";

const TTL_MS = 60 * 60 * 1000; // 1h

export interface SessionOptions {
  /** IP the session was created from, recorded for auditing. */
  ip?: string;
}

/** Create a session for a user. */
export function createSession(userId: string, opts: SessionOptions = {}): Session {
  const now = Date.now();
  const session: Session = {
    token: newId("sess"),
    userId,
    createdAt: now,
    expiresAt: now + TTL_MS,
    lastSeenIp: opts.ip,
  };
  db.sessions.set(session.token, session);
  log("info", "session created", { userId, ip: opts.ip });
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
