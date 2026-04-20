"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
const authPrisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: requireEnv("AUTH_DATABASE_URL"),
        },
    },
});
exports.default = authPrisma;
