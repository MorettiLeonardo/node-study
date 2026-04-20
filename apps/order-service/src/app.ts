import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { orderRoutes } from "./routes/order.routes";
import { loggingMiddleware, requestIdMiddleware } from "@shared/index";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);

app.use("/order", orderRoutes());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "order-service" });
});

app.use(errorMiddleware);
