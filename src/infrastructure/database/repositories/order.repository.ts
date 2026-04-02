import { Order, OrderItem, Product } from "@prisma/client";
import prisma from "../prisma/prisma";

class OrderRepository {
    async create(
        userId: string,
        items: { productId: string; quantity: number }[]
    ) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (!items || items.length === 0) {
            throw new Error("Order must have at least one item");
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: items.map(i => i.productId)
                }
            }
        });

        // 🔥 valida se todos produtos existem
        if (products.length !== items.length) {
            throw new Error("One or more products not found");
        }

        // 🧠 monta os itens do pedido
        const orderItems = items.map(item => {
            const product = products.find(p => p.id === item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (item.quantity <= 0) {
                throw new Error("Quantity must be greater than 0");
            }

            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price // 🔥 sempre do banco
            };
        });

        // 💰 calcula total
        const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // 💾 cria pedido
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: true
            }
        });

        return order;
    }
}


var orderRepository = new OrderRepository();

export { orderRepository };