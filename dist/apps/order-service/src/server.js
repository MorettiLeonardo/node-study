"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const domain_events_consumer_1 = require("./consumers/domain-events.consumer");
const PORT = Number(process.env.ORDER_SERVICE_PORT || 3003);
async function bootstrap() {
    await (0, domain_events_consumer_1.startDomainEventConsumer)();
    app_1.app.listen(PORT, () => {
        console.log(`order-service running on port ${PORT}`);
    });
}
bootstrap().catch((error) => {
    console.error("Failed to start order-service:", error);
    process.exit(1);
});
