import { userByEmail } from "../lib/db.js";
import { log, redactEmail } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { verifyPassword } from "./password.js";
import { createSession } from "./sessions.js";
import { isLockedOut, recordFailure, resetFailures } from "./lockout.js";

export function login(input: { email: string; password: string }) {
  const user = userByEmail(input.email);
  if (!user) {
    log("warn", "login for unknown email", { email: redactEmail(input.email) });
    throw new HttpError(401, "invalid credentials");
  }
  if (isLockedOut(user)) {
    log("warn", "login blocked - too many attempts", { userId: user.id });
    throw new HttpError(429, "account temporarily locked");
  }
  if (!verifyPassword(input.password, user.passwordHash)) {
    recordFailure(user);
    throw new HttpError(401, "invalid credentials");
  }
  resetFailures(user);
  const session = createSession(user.id);
  log("info", "login ok", { userId: user.id });
  return { user, token: session.token };
}
