import { describe, it, expect, beforeEach } from "vitest";
import { db, type User } from "../../src/lib/db.js";
import {
  isLockedOut,
  recordFailure,
  resetFailures,
  lockoutThreshold,
} from "../../src/auth/lockout.js";

beforeEach(() => db.reset());

function makeUser(failedLogins = 0): User {
  const user: User = { id: "user_1", email: "a@example.com", passwordHash: "x", failedLogins };
  db.users.set(user.id, user);
  return user;
}

describe("lockout policy", () => {
  it("defaults the threshold to 5", () => {
    expect(lockoutThreshold()).toBe(5);
  });

  it("is not locked out below the threshold", () => {
    expect(isLockedOut(makeUser(4))).toBe(false);
  });

  it("locks out at the threshold", () => {
    expect(isLockedOut(makeUser(5))).toBe(true);
  });

  it("recordFailure increments and persists", () => {
    recordFailure(makeUser(2));
    expect(db.users.get("user_1")!.failedLogins).toBe(3);
  });

  it("resetFailures clears the counter", () => {
    resetFailures(makeUser(3));
    expect(db.users.get("user_1")!.failedLogins).toBe(0);
  });
});
