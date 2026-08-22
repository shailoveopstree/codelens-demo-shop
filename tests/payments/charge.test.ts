import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/lib/db.js";
import { chargeCard } from "../../src/payments/charge.js";

beforeEach(() => db.reset());

describe("chargeCard", () => {
  it("captures a valid charge", () => {
    const charge = chargeCard({ customerId: "user_1", amount: 20 });
    expect(charge.status).toBe("captured");
  });

  // Not covered: decline path (amount ending .13), invalid-amount path.
});
