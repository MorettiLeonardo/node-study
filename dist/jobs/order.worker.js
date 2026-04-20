"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redistConnection_1 = require("src/config/redistConnection");
const order_repository_1 = require("src/infrastructure/database/repositories/order.repository");
const bullmq_1 = require("bullmq");
new bullmq_1.Worker("order", async (job) => {
    switch (job.name) {
        case "create-order": {
            const { userId, items } = job.data;
            await order_repository_1.orderRepository.create(userId, items);
            break;
        }
        default:
            throw new Error("Job não encontrado");
    }
}, {
    connection: redistConnection_1.redisConnection,
});
//# sourceMappingURL=order.worker.js.map