"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByIdsHandler = void 0;
const product_repository_1 = require("@platform/database/repositories/product.repository");
const zod_1 = __importDefault(require("zod"));
const getProductsByIdsSchema = zod_1.default.object({
    ids: zod_1.default.array(zod_1.default.string().uuid()).min(1),
});
class GetProductsByIdsHandler {
    async execute(request) {
        const parsed = getProductsByIdsSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }
        return product_repository_1.productRepository.findByIds(parsed.data.ids);
    }
}
const getProductsByIdsHandler = new GetProductsByIdsHandler();
exports.getProductsByIdsHandler = getProductsByIdsHandler;
