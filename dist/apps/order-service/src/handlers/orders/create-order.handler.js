"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderHandler = void 0;
const order_repository_1 = require("@platform/database/repositories/order.repository");
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().min(1),
    }))
        .min(1),
});
class CreateOrderHandler {
    async execute(request) {
        const parsed = createOrderSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }
        const { userId, items } = parsed.data;
        const order = await order_repository_1.orderRepository.create(userId, items);
        return { order };
    }
}
const createOrderHandler = new CreateOrderHandler();
exports.createOrderHandler = createOrderHandler;
