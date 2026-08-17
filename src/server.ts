import express from "express";
import { log } from "./lib/logger.js";
import { routes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(routes);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => log("info", "demo-shop listening", { port }));
