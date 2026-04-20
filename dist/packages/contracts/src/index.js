"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = exports.RefreshTokenSchema = exports.LoginSchema = exports.CreateOrderSchema = exports.RolesSchema = exports.ServiceNameSchema = void 0;
const zod_1 = require("zod");
exports.ServiceNameSchema = zod_1.z.enum([
    "api-gateway",
    "auth-service",
    "catalog-service",
    "order-service",
    "notification-service",
]);
exports.RolesSchema = zod_1.z.enum(["ADMIN", "USER"]);
exports.CreateOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().min(1),
    }))
        .min(1),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.ServiceRoutes = {
    auth: ["/auth", "/users"],
    catalog: ["/product"],
    order: ["/order"],
};
