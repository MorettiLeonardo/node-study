"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middleware/error.middleware");
const product_routes_1 = require("./routes/product.routes");
const index_1 = require("@shared/index");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(index_1.requestIdMiddleware);
exports.app.use(index_1.loggingMiddleware);
exports.app.use("/product", (0, product_routes_1.productRoutes)());
exports.app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "catalog-service" });
});
exports.app.use(error_middleware_1.errorMiddleware);
