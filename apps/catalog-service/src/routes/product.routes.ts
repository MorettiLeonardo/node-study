import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize";

export function productRoutes(): Router {
  const router = Router();

  router.post(
    "",
    authMiddleware,
    authorizeMiddleware("ADMIN"),
    productController.createProduct,
  );
  router.post("/internal/by-ids", productController.getByIds);

  return router;
}
