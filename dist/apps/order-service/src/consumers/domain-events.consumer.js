"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDomainEventConsumer = startDomainEventConsumer;
const client_1 = require("@platform/messaging/kafka/client");
const order_repository_1 = require("@platform/database/repositories/order.repository");
async function startDomainEventConsumer() {
    const topics = ["user.created", "user.updated", "product.created", "product.updated"];
    await order_repository_1.orderRepository.initializeReadModel();
    await (0, client_1.ensureTopics)(topics);
    await (0, client_1.createConsumer)(process.env.KAFKA_ORDER_GROUP_ID || "order-service-group", topics, async (topic, event) => {
        if (topic === "user.created" || topic === "user.updated") {
            await order_repository_1.orderRepository.upsertUserProjection(event.payload);
            return;
        }
        if (topic === "product.created" || topic === "product.updated") {
            await order_repository_1.orderRepository.upsertProductProjection(event.payload);
        }
    });
}
