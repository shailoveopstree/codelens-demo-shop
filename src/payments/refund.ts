import { db } from "../lib/db.js";
import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { gateway } from "./gateway.js";

export function refundCharge(chargeId: string, reason?: string) {
  const charge = db.charges.get(chargeId);
  if (!charge) throw new HttpError(404, "charge not found");
  if (charge.status !== "captured") throw new HttpError(409, "charge not refundable");
  gateway.refund(charge.id);
  charge.status = "refunded";
  charge.refundReason = reason;
  db.charges.set(charge.id, charge);
  log("info", "charge refunded", { chargeId, reason });
  return charge;
}
