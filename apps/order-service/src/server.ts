import "dotenv/config";
import { app } from "./app";
import { startDomainEventConsumer } from "./consumers/domain-events.consumer";

const PORT = Number(process.env.ORDER_SERVICE_PORT || 3003);

async function bootstrap() {
  await startDomainEventConsumer();

  app.listen(PORT, () => {
    console.log(`order-service running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start order-service:", error);
  process.exit(1);
});
