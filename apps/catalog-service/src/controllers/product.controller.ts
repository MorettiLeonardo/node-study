import { Request, Response } from "express";
import { createProductHandler } from "../handlers/product/create-product.handler";
import { getProductsByIdsHandler } from "../handlers/product/get-products-by-ids.handler";

export class ProductController {
  async createProduct(req: Request, res: Response) {
    const product = await createProductHandler.execute(req.body);
    return res.status(201).json(product);
  }

  async getByIds(req: Request, res: Response) {
    const products = await getProductsByIdsHandler.execute(req.body);
    return res.status(200).json({ products });
  }
}

const productController = new ProductController();

export { productController };
