import { Prisma } from "../../../../../prisma/generated/order-client";
import orderPrisma from "../prisma/order.prisma";

type UserPayload = {
  id: string;
  email: string;
  role: string;
};

type ProductPayload = {
  id: string;
  name: string;
  price: number;
};

class OrderRepository {
  async initializeReadModel() {
    const maxAttempts = 10;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.createProjectionTables();
        return;
      } catch (error) {
        const isLastAttempt = attempt === maxAttempts;
        if (!isTransientInitializationError(error) || isLastAttempt) {
          throw error;
        }

        const retryDelayMs = attempt * 1000;
        console.warn(
          `Order read-model initialization failed (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelayMs}ms...`,
        );
        await sleep(retryDelayMs);
      }
    }
  }

  private async createProjectionTables() {
    await orderPrisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS UserProjection (
        id VARCHAR(191) PRIMARY KEY,
        email VARCHAR(191) NOT NULL,
        role VARCHAR(50) NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);

    await orderPrisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ProductProjection (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        price DOUBLE NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);
  }

  async upsertUserProjection(user: UserPayload) {
    await orderPrisma.$executeRawUnsafe(
      `
      INSERT INTO UserProjection (id, email, role)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        role = VALUES(role)
      `,
      user.id,
      user.email,
      user.role,
    );
  }

  async upsertProductProjection(product: ProductPayload) {
    await orderPrisma.$executeRawUnsafe(
      `
      INSERT INTO ProductProjection (id, name, price)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        price = VALUES(price)
      `,
      product.id,
      product.name,
      product.price,
    );
  }

  private async fetchUser(userId: string): Promise<UserPayload> {
    const rows = await orderPrisma.$queryRawUnsafe<UserPayload[]>(
      "SELECT id, email, role FROM UserProjection WHERE id = ? LIMIT 1",
      userId,
    );

    const user = rows[0];
    if (!user) {
      throw new Error("User not found in order projection");
    }
    return user;
  }

  private async fetchProducts(productIds: string[]): Promise<ProductPayload[]> {
    const placeholders = productIds.map(() => "?").join(", ");
    const rows = await orderPrisma.$queryRawUnsafe<ProductPayload[]>(
      `SELECT id, name, price FROM ProductProjection WHERE id IN (${placeholders})`,
      ...productIds,
    );

    return rows;
  }

  async create(userId: string, items: { productId: string; quantity: number }[]) {
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

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await orderPrisma.order.create({
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

export { orderRepository };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientInitializationError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return /Server has closed the connection|Can't reach database server|ECONNRESET|ECONNREFUSED|ETIMEDOUT/i.test(
    error.message,
  );
}
