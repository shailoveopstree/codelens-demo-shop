import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/auth/password.js";

describe("password", () => {
  it("verifies a matching password", () => {
    const hash = hashPassword("hunter2");
    expect(verifyPassword("hunter2", hash)).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(verifyPassword("nope", hashPassword("hunter2"))).toBe(false);
  });
});
