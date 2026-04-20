"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductHandler = exports.CreateProductHandler = void 0;
const product_repository_1 = require("@platform/database/repositories/product.repository");
const client_1 = require("@platform/messaging/kafka/client");
const product_entity_1 = require("@shared/domain/entities/product.entity");
const zod_1 = __importDefault(require("zod"));
const createProductSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().positive(),
});
class CreateProductHandler {
    async execute(request) {
        const parsed = createProductSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }
        const newProduct = new product_entity_1.Product(parsed.data);
        const product = await product_repository_1.productRepository.create(newProduct);
        await (0, client_1.publishEvent)("product.created", "ProductCreated", {
            id: product.id,
            name: product.name,
            price: product.price,
        }, product.id);
        return { product };
    }
}
exports.CreateProductHandler = CreateProductHandler;
const createProductHandler = new CreateProductHandler();
exports.createProductHandler = createProductHandler;
