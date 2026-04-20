import { z } from "zod";
import { orderQueue } from "../../../infrastructure/messaging/queues/orderQueue";

const createOrderSchema = z.object({
    userId: z.string().uuid(),
    items: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().min(1)
        })
    ).min(1)
});

type CreateOrderRequest = z.infer<typeof createOrderSchema>;

interface CreateOrderResponse {
    message: string;
}

class CreateOrderHandler {
    async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
        const parsed = createOrderSchema.safeParse(request);

        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }

        const { userId, items } = parsed.data;

        await orderQueue.add("create-order", {
            userId,
            items
        });

        return {
            message: "Order created."
        };
    }
}

var createOrderHandler = new CreateOrderHandler();

export { createOrderHandler }