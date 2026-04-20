import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/order/schema.prisma",
  migrations: {
    path: "prisma/order/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("ORDER_DATABASE_URL"),
  },
});
