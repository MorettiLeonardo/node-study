import { z } from "zod";

export const ServiceNameSchema = z.enum([
  "api-gateway",
  "auth-service",
  "catalog-service",
  "order-service",
  "notification-service",
]);

export type ServiceName = z.infer<typeof ServiceNameSchema>;

export const RolesSchema = z.enum(["ADMIN", "USER"]);
export type UserRole = z.infer<typeof RolesSchema>;

export const CreateOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const ServiceRoutes = {
  auth: ["/auth", "/users"] as const,
  catalog: ["/product"] as const,
  order: ["/order"] as const,
} as const;
