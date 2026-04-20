import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/auth/schema.prisma",
  migrations: {
    path: "prisma/auth/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("AUTH_DATABASE_URL"),
  },
});
