import { describe, it, expect, beforeEach } from "vitest";
import type { Order } from "../../src/lib/db.js";
import { sendReceipt, sendShippingUpdate, pendingCount, _outbox } from "../../src/notifications/email.js";

const order: Order = { id: "ord_1", userId: "user_1", items: ["widget"], chargeId: "ch_1", total: 9 };

beforeEach(() => void (_outbox().length = 0));

describe("email notifications", () => {
  it("queues a receipt email", () => {
    sendReceipt(order, "a@example.com");
    expect(_outbox()[0].subject).toBe("Receipt for order ord_1");
  });

  it("queues a shipping update naming the carrier", () => {
    sendShippingUpdate(order, "a@example.com", "PostNL");
    expect(_outbox()[0].subject).toBe("Order ord_1 has shipped");
    expect(_outbox()[0].body).toContain("PostNL");
  });

  it("pendingCount reflects the queue length", () => {
    expect(pendingCount()).toBe(0);
    sendReceipt(order, "a@example.com");
    expect(pendingCount()).toBe(1);
  });
});
