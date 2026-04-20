import { PrismaClient } from "@prisma/client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const orderPrisma = new PrismaClient({
  datasources: {
    db: {
      url: requireEnv("ORDER_DATABASE_URL"),
    },
  },
});

export default orderPrisma;
