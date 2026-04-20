import { Request, Response } from "express";
import { createOrderHandler } from "../handlers/orders/create-order.handler";

export class OrderController {
  async createOrderAsync(req: Request, res: Response) {
    const result = await createOrderHandler.execute(req.body);
    return res.status(201).json(result);
  }
}

const orderController = new OrderController();

export { orderController };
