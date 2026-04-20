import { PrismaClient } from "@prisma/client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const authPrisma = new PrismaClient({
  datasources: {
    db: {
      url: requireEnv("AUTH_DATABASE_URL"),
    },
  },
});

export default authPrisma;
