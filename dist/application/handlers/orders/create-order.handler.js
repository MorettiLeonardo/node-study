"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderHandler = void 0;
const orderQueue_1 = require("src/infrastructure/messaging/queues/orderQueue");
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().min(1)
    })).min(1)
});
class CreateOrderHandler {
    async execute(request) {
        const parsed = createOrderSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }
        const { userId, items } = parsed.data;
        await orderQueue_1.orderQueue.add("create-order", {
            userId,
            items
        });
        return {
            message: "Order created."
        };
    }
}
var createOrderHandler = new CreateOrderHandler();
exports.createOrderHandler = createOrderHandler;
//# sourceMappingURL=create-order.handler.js.map