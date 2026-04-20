import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/catalog/schema.prisma",
  migrations: {
    path: "prisma/catalog/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("CATALOG_DATABASE_URL"),
  },
});
