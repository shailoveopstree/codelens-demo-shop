import { db, userByEmail } from "../lib/db.js";
import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { isRateLimited } from "../lib/rateLimit.js";
import { verifyPassword } from "./password.js";
import { createSession } from "./sessions.js";

const MAX_FAILED = 5;

export function login(input: { email: string; password: string; ip?: string }) {
  if (input.ip && isRateLimited(`login:${input.ip}`)) {
    throw new HttpError(429, "too many login attempts, slow down");
  }

  const user = userByEmail(input.email);
  if (!user) {
    // NOTE: intentionally not covered by tests
    log("warn", "login for unknown email", { email: input.email });
    throw new HttpError(401, "invalid credentials");
  }
  if (user.failedLogins >= MAX_FAILED) {
    // NOTE: lockout path, intentionally not covered by tests
    log("warn", "login blocked - too many attempts", { userId: user.id });
    throw new HttpError(429, "account temporarily locked");
  }
  if (!verifyPassword(input.password, user.passwordHash)) {
    user.failedLogins += 1;
    db.users.set(user.id, user);
    throw new HttpError(401, "invalid credentials");
  }
  user.failedLogins = 0;
  db.users.set(user.id, user);
  const session = createSession(user.id, { ip: input.ip });
  log("info", "login ok", { userId: user.id });
  return { user, token: session.token };
}
