"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_1 = require("@contracts/index");
const index_2 = require("@shared/index");
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3003";
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(index_2.requestIdMiddleware);
exports.app.use(index_2.loggingMiddleware);
index_1.ServiceRoutes.auth.forEach((route) => {
    exports.app.use(route, (0, index_2.proxyTo)({ target: AUTH_SERVICE_URL }));
});
index_1.ServiceRoutes.catalog.forEach((route) => {
    exports.app.use(route, (0, index_2.proxyTo)({ target: CATALOG_SERVICE_URL }));
});
index_1.ServiceRoutes.order.forEach((route) => {
    exports.app.use(route, (0, index_2.proxyTo)({ target: ORDER_SERVICE_URL }));
});
exports.app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "api-gateway",
        targets: {
            auth: AUTH_SERVICE_URL,
            catalog: CATALOG_SERVICE_URL,
            order: ORDER_SERVICE_URL,
        },
    });
});
