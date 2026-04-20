import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { productRoutes } from "./routes/product.routes";
import { loggingMiddleware, requestIdMiddleware } from "@shared/index";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);

app.use("/product", productRoutes());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "catalog-service" });
});

app.use(errorMiddleware);
