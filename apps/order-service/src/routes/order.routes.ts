import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export function orderRoutes(): Router {
  const router = Router();

  router.post("", authMiddleware, orderController.createOrderAsync);

  return router;
}
