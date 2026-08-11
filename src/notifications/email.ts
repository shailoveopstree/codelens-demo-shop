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

export function _outbox() {
  return outbox;
}
