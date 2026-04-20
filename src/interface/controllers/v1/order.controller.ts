import { Request, Response } from "express";
import { createOrderHandler } from "../../../application/handlers/orders/create-order.handler";

export class OrderController {
    async createOrderAsync(req: Request, res: Response) {
        const result = await createOrderHandler.execute(req.body);

        res.status(201).json(result);
    }
}

var orderController = new OrderController();

export { orderController }
