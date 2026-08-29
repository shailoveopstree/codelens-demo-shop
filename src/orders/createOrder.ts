import { db, type Order } from "../lib/db.js";
import { newId } from "../lib/ids.js";
import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { chargeCard } from "../payments/charge.js";
import { sendReceipt } from "../notifications/email.js";
import { priceOf } from "../catalog.js";

export function createOrder(input: { userId: string; email: string; items: string[] }): Order {
  if (input.items.length === 0) throw new HttpError(400, "no items");
  const total = input.items.reduce((sum, item) => sum + priceOf(item), 0);
  const charge = chargeCard({ customerId: input.userId, amount: total });
  const order: Order = {
    id: newId("ord"),
    userId: input.userId,
    items: input.items,
    chargeId: charge.id,
    total,
  };
  db.orders.set(order.id, order);
  sendReceipt(order, input.email);
  log("info", "order created", { orderId: order.id, total });
  return order;
}
