import { Request, Response } from "express";
import { createProductHandler } from "../../../application/handlers/product/create-product.handler";

class ProductController {
    async createProduct(req: Request, res: Response) {
        try {
            const product = await createProductHandler.execute(req.body);
            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
    }
}
var productController = new ProductController();

export { productController }
