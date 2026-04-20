"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisConnection_1 = require("@platform/config/redisConnection");
const bullmq_1 = require("bullmq");
const email_service_1 = require("../services/email.service");
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
    connection: redisConnection_1.redisConnection,
    concurrency: 10,
});
console.log("notification-service mail worker running");
