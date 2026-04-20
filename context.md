# Project context (AI-friendly)

## What this repo is
A Node.js + TypeScript microservices workspace.

**Public entrypoint:** API Gateway (`apps/api-gateway`) proxies HTTP routes to internal services.

**Services:**
- `apps/api-gateway` — public HTTP gateway (Express)
- `apps/auth-service` — auth/users/login/refresh token (Express + MySQL)
- `apps/catalog-service` — product catalog (Express + MySQL)
- `apps/order-service` — orders + read models from Kafka domain events (Express + MySQL + Kafka consumer)
- `apps/notification-service` — background mail worker (BullMQ + Redis)

**Infra:**
- MySQL per service (auth/catalog/order)
- Kafka for cross-service domain events
- Redis + BullMQ for email jobs

## High-level request flow
1. Client calls **API Gateway** on port `3000`.
2. Gateway proxies based on route prefix:
   - `/auth`, `/users` → auth-service
   - `/product` → catalog-service
   - `/order` → order-service
3. Services handle requests with Express.

**Gateway route map** comes from `packages/contracts` (`ServiceRoutes`).

## Domain events (Kafka)
Kafka utilities live in `packages/platform/src/messaging/kafka/client.ts`.

- `publishEvent(topic, type, payload, key?)` publishes JSON `{ type, payload, occurredAt }`.
- `createConsumer(groupId, topics, handler)` subscribes and runs `handler(topic, event)`.

**Order service** runs a Kafka consumer during startup and maintains local projections for users/products so it does not need synchronous HTTP calls to auth/catalog.

## Background jobs (BullMQ/Redis)
Notification service is a worker-only process.

- `apps/notification-service/src/server.ts` imports `./workers/mail.worker` to start the worker.
- Worker uses a BullMQ `Worker("mail", handler)` with Redis connection from `@platform/config/redisConnection`.
- The worker currently handles job name `send-registration-email`.

## Shared packages
### `packages/contracts`
Zod schemas + route prefixes shared by services.

- `ServiceRoutes`: route prefixes the gateway uses to proxy.
- DTO validation schemas like `LoginSchema`, `CreateOrderSchema`.

### `packages/shared`
Cross-cutting web utilities.

- `requestIdMiddleware`: sets `x-request-id` header + attaches `req.requestId`.
- `loggingMiddleware`: logs request method/path/status/duration.
- `proxyTo`: simple fetch-based reverse proxy used by gateway.

### `packages/platform`
Infrastructure adapters used by services.

- DB repositories (Prisma-based)
- Kafka client helpers
- Redis connection
- BullMQ queue(s)

## Logging + correlation
HTTP services use:
- `requestIdMiddleware` (adds/propagates `x-request-id`)
- `loggingMiddleware` (logs at response finish)

When you add new HTTP endpoints, keep these middlewares early in the Express pipeline so every request has a request id and logs.

## Databases + Prisma
Each service has its own Prisma schema + migrations:
- `prisma/auth/schema.prisma` + migrations in `prisma/auth/migrations`
- `prisma/catalog/schema.prisma` + migrations in `prisma/catalog/migrations`
- `prisma/order/schema.prisma` + migrations in `prisma/order/migrations`

Prisma config files:
- `prisma.auth.config.ts` uses `AUTH_DATABASE_URL`
- `prisma.catalog.config.ts` uses `CATALOG_DATABASE_URL`
- `prisma.order.config.ts` uses `ORDER_DATABASE_URL`

Generated Prisma clients are checked into `prisma/generated/*-client`.

## Ports (local dev defaults)
- API Gateway: `3000`
- Auth service: `3001`
- Catalog service: `3002`
- Order service: `3003`

MySQL containers (docker-compose):
- auth: host port `3308` → container `3306`
- catalog: host port `3309` → container `3306`
- order: host port `3310` → container `3306`

Redis: `6379`
Kafka: `29092` (host), `9092` (internal)

## Environment variables
Required (see `ops-runbook.txt`):
- `AUTH_DATABASE_URL`, `CATALOG_DATABASE_URL`, `ORDER_DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`
- `KAFKA_BROKERS`, `KAFKA_CLIENT_ID`, `KAFKA_ORDER_GROUP_ID`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `EMAIL_USER`, `EMAIL_PASS`

Gateway routing variables:
- `AUTH_SERVICE_URL`, `CATALOG_SERVICE_URL`, `ORDER_SERVICE_URL`

Service ports:
- `PORT` (gateway)
- `AUTH_SERVICE_PORT`, `CATALOG_SERVICE_PORT`, `ORDER_SERVICE_PORT`

## How to run (local)
### 1) Install
```bash
npm install
```

### 2) Start infra
```bash
docker compose up -d mysql-auth mysql-catalog mysql-order redis kafka
```

### 3) Generate Prisma clients
```bash
npm run prisma:generate:all
```

### 4) Apply DB migrations
```bash
npm run db:bootstrap:services
```

### 5) Run all services
```bash
npm run dev
```

Health endpoints:
- Gateway: `GET /health`
- Auth: `GET /health`
- Catalog: `GET /health`
- Order: `GET /health`

## Useful repo commands
- `npm run dev` — run everything in watch mode
- `npm run dev:gateway|dev:auth|dev:catalog|dev:order|dev:notification` — run one process
- `npm test` — `tsc --noEmit` + boundary checks
- `npm run check:boundaries` — import boundary enforcement

## Where to start when editing
- HTTP routing / proxy: `apps/api-gateway/src/app.ts` + `packages/shared/src/proxy.ts`
- Auth endpoints: `apps/auth-service/src/routes/*`
- Catalog endpoints: `apps/catalog-service/src/routes/*`
- Order endpoints + consumer: `apps/order-service/src/routes/*` and `apps/order-service/src/consumers/domain-events.consumer.ts`
- Notification jobs: `apps/notification-service/src/workers/mail.worker.ts`
