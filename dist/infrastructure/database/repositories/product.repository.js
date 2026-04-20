"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = void 0;
const product_entity_1 = require("src/domain/entities/product.entity");
const prisma_1 = __importDefault(require("../prisma/prisma"));
class ProductRepository {
    toProductEntity(data) {
        return new product_entity_1.Product({
            id: data.id,
            name: data.name,
            price: data.price,
        });
    }
    async create(product) {
        const createdProduct = await prisma_1.default.product.create({
            data: {
                name: product.name,
                price: product.price
            }
        });
        return this.toProductEntity(createdProduct);
    }
}
var productRepository = new ProductRepository();
exports.productRepository = productRepository;
//# sourceMappingURL=product.repository.js.map