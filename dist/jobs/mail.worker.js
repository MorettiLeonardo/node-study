"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const email_service_1 = require("src/application/external-services/email.service");
const redistConnection_1 = require("src/config/redistConnection");
new bullmq_1.Worker("mail", async (job) => {
    switch (job.name) {
        case "send-registration-email": {
            const { to, subject, text } = job.data;
            await (0, email_service_1.sendEmail)(to, subject, text);
            break;
        }
        default:
            throw new Error(`Unknown job: ${job.name}`);
    }
}, {
    connection: redistConnection_1.redisConnection,
    concurrency: 10
});
console.log("📬 Mail worker rodando...");
//# sourceMappingURL=mail.worker.js.map