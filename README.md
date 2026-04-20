# Node Study - Microservices API

This project is a Node.js + TypeScript microservices architecture with:

- **API Gateway** (`apps/api-gateway`) - public entrypoint
- **Auth Service** (`apps/auth-service`) - users, login, refresh token
- **Catalog Service** (`apps/catalog-service`) - products
- **Order Service** (`apps/order-service`) - orders
- **Notification Service** (`apps/notification-service`) - async email worker (Redis/BullMQ)

It uses **MySQL per service**, **Kafka** for domain events between services, and **Redis/BullMQ** for email jobs.

## Project structure

- `apps/` - service applications
- `packages/shared/` - shared contracts/utilities/domain pieces
- `packages/platform/` - database, queue, infra adapters
- `prisma/auth|catalog|order/` - service-specific Prisma schemas and migrations
- `docker-compose.yml` - local infrastructure + services

## Prerequisites

- Node.js 20+ (or newer)
- npm
- Docker + Docker Compose

## Environment configuration

Create `.env` (or copy from `.env.services.example`) with:

```env
AUTH_DATABASE_URL=mysql://user:user@localhost:3308/auth-db
CATALOG_DATABASE_URL=mysql://user:user@localhost:3309/catalog-db
ORDER_DATABASE_URL=mysql://user:user@localhost:3310/order-db

REDIS_HOST=localhost
REDIS_PORT=6379

KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=node-study-local
KAFKA_ORDER_GROUP_ID=order-service-group

JWT_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me
EMAIL_USER=replace-me
EMAIL_PASS=replace-me
```

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start infrastructure:

```bash
docker compose up -d mysql-auth mysql-catalog mysql-order redis kafka
```

3. Generate Prisma clients:

```bash
npm run prisma:generate:all
```

4. Apply migrations:

```bash
npm run db:bootstrap:services
```

5. Start all services:

```bash
npm run dev
```

Gateway runs on `http://localhost:3000`.

## Useful scripts

- `npm run test` - type-check + boundary checks
- `npm run typecheck` - TypeScript checks
- `npm run prisma:migrate:deploy:all` - deploy all service DB migrations
- `npm run dev:auth|dev:catalog|dev:order|dev:gateway|dev:notification` - run one service

## Notes

- Do not commit `.env`.
- Rotate credentials if secrets were exposed.
- Order service validates users/products from Kafka-fed local projections (no sync HTTP dependency on Auth/Catalog).
