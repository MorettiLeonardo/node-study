import { Order } from "@prisma/client";
import { orderRepository } from "@platform/database/repositories/order.repository";
import { z } from "zod";

const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});

type CreateOrderRequest = z.infer<typeof createOrderSchema>;

interface CreateOrderResponse {
  order: Order;
}

class CreateOrderHandler {
  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const parsed = createOrderSchema.safeParse(request);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const { userId, items } = parsed.data;

    const order = await orderRepository.create(userId, items);

    return { order };
  }
}

const createOrderHandler = new CreateOrderHandler();

export { createOrderHandler };
