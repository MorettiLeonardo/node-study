import { PrismaClient } from "../../../../../prisma/generated/catalog-client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const catalogPrisma = new PrismaClient({
  datasources: {
    db: {
      url: requireEnv("CATALOG_DATABASE_URL"),
    },
  },
});

export default catalogPrisma;
