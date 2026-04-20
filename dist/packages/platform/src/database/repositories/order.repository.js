"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
const client_1 = require("@prisma/client");
const order_prisma_1 = __importDefault(require("../prisma/order.prisma"));
class OrderRepository {
    async initializeReadModel() {
        const maxAttempts = 10;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await this.createProjectionTables();
                return;
            }
            catch (error) {
                const isLastAttempt = attempt === maxAttempts;
                if (!isTransientInitializationError(error) || isLastAttempt) {
                    throw error;
                }
                const retryDelayMs = attempt * 1000;
                console.warn(`Order read-model initialization failed (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelayMs}ms...`);
                await sleep(retryDelayMs);
            }
        }
    }
    async createProjectionTables() {
        await order_prisma_1.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS UserProjection (
        id VARCHAR(191) PRIMARY KEY,
        email VARCHAR(191) NOT NULL,
        role VARCHAR(50) NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);
        await order_prisma_1.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ProductProjection (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        price DOUBLE NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);
    }
    async upsertUserProjection(user) {
        await order_prisma_1.default.$executeRawUnsafe(`
      INSERT INTO UserProjection (id, email, role)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        role = VALUES(role)
      `, user.id, user.email, user.role);
    }
    async upsertProductProjection(product) {
        await order_prisma_1.default.$executeRawUnsafe(`
      INSERT INTO ProductProjection (id, name, price)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        price = VALUES(price)
      `, product.id, product.name, product.price);
    }
    async fetchUser(userId) {
        const rows = await order_prisma_1.default.$queryRawUnsafe("SELECT id, email, role FROM UserProjection WHERE id = ? LIMIT 1", userId);
        const user = rows[0];
        if (!user) {
            throw new Error("User not found in order projection");
        }
        return user;
    }
    async fetchProducts(productIds) {
        const placeholders = productIds.map(() => "?").join(", ");
        const rows = await order_prisma_1.default.$queryRawUnsafe(`SELECT id, name, price FROM ProductProjection WHERE id IN (${placeholders})`, ...productIds);
        return rows;
    }
    async create(userId, items) {
        const user = await this.fetchUser(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!items || items.length === 0) {
            throw new Error("Order must have at least one item");
        }
        const products = await this.fetchProducts(items.map((i) => i.productId));
        if (products.length !== items.length) {
            throw new Error("One or more products not found");
        }
        const orderItems = items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (item.quantity <= 0) {
                throw new Error("Quantity must be greater than 0");
            }
            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            };
        });
        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await order_prisma_1.default.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
            },
        });
        return order;
    }
}
const orderRepository = new OrderRepository();
exports.orderRepository = orderRepository;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function isTransientInitializationError(error) {
    if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        return true;
    }
    if (!(error instanceof Error)) {
        return false;
    }
    return /Server has closed the connection|Can't reach database server|ECONNRESET|ECONNREFUSED|ETIMEDOUT/i.test(error.message);
}
