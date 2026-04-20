"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailQueue = void 0;
const bullmq_1 = require("bullmq");
const redistConnection_1 = require("src/config/redistConnection");
exports.mailQueue = new bullmq_1.Queue("mail", {
    connection: redistConnection_1.redisConnection
});
exports.mailQueue.on("error", (error) => {
    console.error("Mail Queue Error:", error);
});
//# sourceMappingURL=mail.queue.js.map