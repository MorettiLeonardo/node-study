import { orderRepository } from "../database/repositories/order.repository";
import { createConsumer, ensureTopics } from "../messaging/kafka/client";

type UserEventPayload = {
  id: string;
  email: string;
  role: string;
};

type ProductEventPayload = {
  id: string;
  name: string;
  price: number;
};

export async function startDomainEventConsumer() {
  const topics = ["user.created", "user.updated", "product.created", "product.updated"];

  await orderRepository.initializeReadModel();
  await ensureTopics(topics);

  await createConsumer(
    process.env.KAFKA_ORDER_GROUP_ID || "order-service-group",
    topics,
    async (topic, event) => {
      if (topic === "user.created" || topic === "user.updated") {
        await orderRepository.upsertUserProjection(event.payload as UserEventPayload);
        return;
      }

      if (topic === "product.created" || topic === "product.updated") {
        await orderRepository.upsertProductProjection(event.payload as ProductEventPayload);
      }
    },
  );
}
