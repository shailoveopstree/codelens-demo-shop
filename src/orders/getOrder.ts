import { db, type Order } from "../lib/db.js";
import { HttpError } from "../lib/httpError.js";

export function getOrder(id: string): Order {
  const order = db.orders.get(id);
  if (!order) throw new HttpError(404, "order not found");
  return order;
}
