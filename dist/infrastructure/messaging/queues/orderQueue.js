"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueue = void 0;
const bullmq_1 = require("bullmq");
const redistConnection_1 = require("src/config/redistConnection");
exports.orderQueue = new bullmq_1.Queue("order", {
    connection: redistConnection_1.redisConnection,
});
//# sourceMappingURL=orderQueue.js.map