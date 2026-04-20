import cors from "cors";
import express from "express";
import { ServiceRoutes } from "@contracts/index";
import { loggingMiddleware, proxyTo, requestIdMiddleware } from "@shared/index";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const CATALOG_SERVICE_URL =
  process.env.CATALOG_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);

ServiceRoutes.auth.forEach((route) => {
  app.use(route, proxyTo({ target: AUTH_SERVICE_URL }));
});

ServiceRoutes.catalog.forEach((route) => {
  app.use(route, proxyTo({ target: CATALOG_SERVICE_URL }));
});

ServiceRoutes.order.forEach((route) => {
  app.use(route, proxyTo({ target: ORDER_SERVICE_URL }));
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
    targets: {
      auth: AUTH_SERVICE_URL,
      catalog: CATALOG_SERVICE_URL,
      order: ORDER_SERVICE_URL,
    },
  });
});
