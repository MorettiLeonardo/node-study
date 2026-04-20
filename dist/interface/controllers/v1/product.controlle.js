"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const create_product_handler_1 = require("src/application/handlers/product/create-product.handler");
class ProductController {
    async createProduct(req, res) {
        try {
            const product = await create_product_handler_1.createProductHandler.execute(req.body);
            return res.status(201).json(product);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
var productController = new ProductController();
exports.productController = productController;
//# sourceMappingURL=product.controlle.js.map