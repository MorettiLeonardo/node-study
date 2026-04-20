"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailQueue = void 0;
const bullmq_1 = require("bullmq");
const redisConnection_1 = require("@platform/config/redisConnection");
exports.mailQueue = new bullmq_1.Queue("mail", {
    connection: redisConnection_1.redisConnection,
});
exports.mailQueue.on("error", (error) => {
    console.error("Mail Queue Error:", error);
});
