import { Request, Response } from "express";
import { loginHandler } from "../handlers/auth/login.handler";
import { refreshTokenHandler } from "../handlers/auth/refresh-token.handler";

export class AuthController {
  async login(req: Request, res: Response) {
    const result = await loginHandler.execute(req.body);
    return res.status(200).json(result);
  }

  async refreshTokenController(req: Request, res: Response) {
    const result = await refreshTokenHandler.execute(req.body);
    return res.status(200).json(result);
  }
}

const authController = new AuthController();

export default authController;
