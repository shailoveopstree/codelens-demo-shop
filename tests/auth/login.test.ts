import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/lib/db.js";
import { register } from "../../src/auth/register.js";
import { login } from "../../src/auth/login.js";

beforeEach(() => db.reset());

describe("login", () => {
  it("issues a token for valid credentials", () => {
    register({ email: "a@example.com", password: "pw" });
    const out = login({ email: "a@example.com", password: "pw" });
    expect(out.token).toMatch(/^sess_/);
  });

  it("rejects a wrong password", () => {
    register({ email: "b@example.com", password: "right" });
    expect(() => login({ email: "b@example.com", password: "wrong" })).toThrow(
      /invalid credentials/,
    );
  });

  // Not covered: unknown-email path, lockout-after-5-failures path.
});
