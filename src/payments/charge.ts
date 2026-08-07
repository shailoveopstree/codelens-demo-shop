import { db, type Charge } from "../lib/db.js";
import { newId } from "../lib/ids.js";
import { log } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";
import { gateway } from "./gateway.js";

export function chargeCard(input: { customerId: string; amount: number }): Charge {
  if (input.amount <= 0) {
    // NOTE: invalid-amount path, intentionally not covered by tests
    throw new HttpError(400, "amount must be positive");
  }
  const auth = gateway.authorize(input.customerId, input.amount);
  if (!auth.ok) {
    // NOTE: decline path, intentionally not covered by tests
    const declined: Charge = {
      id: newId("ch"),
      customerId: input.customerId,
      amount: input.amount,
      status: "declined",
    };
    db.charges.set(declined.id, declined);
    throw new HttpError(402, "card declined");
  }
  gateway.capture(auth.reference);
  const charge: Charge = {
    id: newId("ch"),
    customerId: input.customerId,
    amount: input.amount,
    status: "captured",
  };
  db.charges.set(charge.id, charge);
  log("info", "charge captured", { chargeId: charge.id, amount: charge.amount });
  return charge;
}
