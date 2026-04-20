"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
exports.loggingMiddleware = loggingMiddleware;
const crypto_1 = require("crypto");
function requestIdMiddleware(req, res, next) {
    const requestId = req.header("x-request-id") || (0, crypto_1.randomUUID)();
    res.setHeader("x-request-id", requestId);
    req.requestId = requestId;
    next();
}
function loggingMiddleware(req, res, next) {
    const start = Date.now();
    const requestId = req.header("x-request-id");
    res.on("finish", () => {
        console.log(JSON.stringify({
            requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            durationMs: Date.now() - start,
        }));
    });
    next();
}
