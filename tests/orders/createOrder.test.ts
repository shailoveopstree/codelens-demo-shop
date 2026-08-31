import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../src/lib/db.js";
import { createOrder } from "../../src/orders/createOrder.js";

beforeEach(() => db.reset());

describe("createOrder", () => {
  it("charges and stores an order", () => {
    const order = createOrder({ userId: "user_1", email: "a@example.com", items: ["widget", "bolt"] });
    expect(order.total).toBe(10);
    expect(db.orders.get(order.id)).toBeDefined();
  });
});
