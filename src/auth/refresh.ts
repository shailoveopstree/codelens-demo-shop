import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { createSession, getSession, revokeSession } from "./sessions.js";

/** Rotate a session token: revoke the old one and issue a fresh session. */
export function refresh(oldToken: string) {
  const session = getSession(oldToken);
  if (!session) throw new HttpError(401, "session expired");
  revokeSession(oldToken);
  const next = createSession(session.userId);
  log("info", "session refreshed", { userId: session.userId });
  return { token: next.token };
}
