import { Router } from "express";
import { HttpError } from "./lib/httpError.js";
import { login } from "./auth/login.js";
import { register } from "./auth/register.js";
import { refresh } from "./auth/refresh.js";
import { createOrder } from "./orders/createOrder.js";
import { getOrder } from "./orders/getOrder.js";
import { refundCharge } from "./payments/refund.js";

export const routes = Router();

function wrap(fn: (body: any, params: any) => unknown) {
  return (req: any, res: any) => {
    try {
      res.json(fn(req.body ?? {}, req.params ?? {}));
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      res.status(status).json({ error: (err as Error).message });
    }
  };
}

routes.post("/auth/register", wrap((body) => register(body)));
routes.post("/auth/login", wrap((body) => login(body)));
routes.post("/auth/refresh", wrap((body) => refresh(body.token)));
routes.post("/orders", wrap((body) => createOrder(body)));
routes.get("/orders/:id", wrap((_body, params) => getOrder(params.id)));
routes.post("/charges/:id/refund", wrap((_body, params) => refundCharge(params.id)));
