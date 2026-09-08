import { log } from "../lib/logger.js";
import type { Order } from "../lib/db.js";

const outbox: { to: string; subject: string; body: string }[] = [];

export function sendEmail(to: string, subject: string, body: string): void {
  outbox.push({ to, subject, body });
  log("info", "email queued", { to, subject });
}

export function sendReceipt(order: Order, to: string): void {
  sendEmail(to, `Receipt for order ${order.id}`, `You were charged ${order.total}`);
}

export function sendShippingUpdate(order: Order, to: string, carrier: string): void {
  sendEmail(
    to,
    `Order ${order.id} has shipped`,
    `Your order is on its way with ${carrier}.`,
  );
}

/** How many emails are currently queued in the outbox. */
export function pendingCount(): number {
  return outbox.length;
}

export function _outbox() {
  return outbox;
}
