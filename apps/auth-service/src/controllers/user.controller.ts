import { NextFunction, Request, Response } from "express";
import { createUserHandler } from "../handlers/users/create-user.handler";
import { getUserByIdHandler } from "../handlers/users/get-user-by-id.handler";
import { updateUserHandler } from "../handlers/users/update-user.handler";

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await createUserHandler.execute(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await updateUserHandler.execute(String(id), req.body);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async getInternalById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await getUserByIdHandler.execute(String(id));
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();

export default userController;
