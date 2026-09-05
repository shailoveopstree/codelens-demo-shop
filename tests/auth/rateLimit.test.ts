import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/lib/db.js";
import { register } from "../../src/auth/register.js";
import { login } from "../../src/auth/login.js";
import { resetRateLimiter } from "../../src/lib/rateLimit.js";

beforeEach(() => {
  db.reset();
  resetRateLimiter();
});

describe("login rate limiting", () => {
  it("allows a login that is under the limit", () => {
    register({ email: "c@example.com", password: "pw", ip: "10.0.0.1" });
    const out = login({ email: "c@example.com", password: "pw", ip: "10.0.0.1" });
    expect(out.token).toMatch(/^sess_/);
  });

  // Not covered: the over-limit branch that returns HTTP 429.
});
