import { Router } from "express";
import userController from "../controllers/user.controller";

export function userRoutes(): Router {
  const router = Router();

  router.post("/register", userController.register);
  router.put("/update/:id", userController.update);
  router.get("/internal/:id", userController.getInternalById);

  return router;
}
