"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const create_product_handler_1 = require("../handlers/product/create-product.handler");
const get_products_by_ids_handler_1 = require("../handlers/product/get-products-by-ids.handler");
class ProductController {
    async createProduct(req, res) {
        const product = await create_product_handler_1.createProductHandler.execute(req.body);
        return res.status(201).json(product);
    }
    async getByIds(req, res) {
        const products = await get_products_by_ids_handler_1.getProductsByIdsHandler.execute(req.body);
        return res.status(200).json({ products });
    }
}
exports.ProductController = ProductController;
const productController = new ProductController();
exports.productController = productController;
