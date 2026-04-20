import { Router } from "express";
import authController from "../controllers/auth.controller";

export function authRoutes(): Router {
  const router = Router();

  router.post("/login", authController.login);
  router.post("/refresh-token", authController.refreshTokenController);

  return router;
}
