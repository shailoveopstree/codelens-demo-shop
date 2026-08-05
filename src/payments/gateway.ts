import { log } from "../lib/logger.js";

export interface AuthResult {
  ok: boolean;
  reference: string;
}

/** Stand-in for a real card gateway. Declines amounts ending in .13 for demos. */
export class FakeGateway {
  authorize(customerId: string, amount: number): AuthResult {
    const declined = Math.round(amount * 100) % 100 === 13;
    log("info", "gateway.authorize", { customerId, amount, declined });
    return { ok: !declined, reference: `auth_${Math.random().toString(36).slice(2)}` };
  }

  capture(reference: string): boolean {
    log("info", "gateway.capture", { reference });
    return true;
  }

  refund(reference: string): boolean {
    log("info", "gateway.refund", { reference });
    return true;
  }
}

export const gateway = new FakeGateway();
