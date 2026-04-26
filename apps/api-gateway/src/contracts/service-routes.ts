export const ServiceRoutes = {
  auth: ["/auth", "/users"] as const,
  catalog: ["/product"] as const,
  order: ["/order"] as const,
} as const;
