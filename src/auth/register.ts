import { db, userByEmail, type User } from "../lib/db.js";
import { newId } from "../lib/ids.js";
import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { hashPassword } from "./password.js";
import { createSession } from "./sessions.js";

export function register(input: { email: string; password: string; ip?: string }) {
  if (userByEmail(input.email)) {
    throw new HttpError(409, "email already registered");
  }
  const user: User = {
    id: newId("user"),
    email: input.email,
    passwordHash: hashPassword(input.password),
    failedLogins: 0,
  };
  db.users.set(user.id, user);
  log("info", "user registered", { userId: user.id });
  const session = createSession(user.id, { ip: input.ip });
  return { user, token: session.token };
}
