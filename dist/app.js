"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = require("./interface/routes/user.routes");
const error_middleware_1 = require("./interface/middleware/error.middleware");
const auth_routes_1 = require("./interface/routes/auth.routes");
const order_routes_1 = require("./interface/routes/order.routes");
const product_routes_1 = require("./interface/routes/product.routes");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use('/users', (0, user_routes_1.userRoutes)());
exports.app.use('/auth', (0, auth_routes_1.authRoutes)());
exports.app.use('/order', (0, order_routes_1.orderoutes)());
exports.app.use('/product', (0, product_routes_1.productRoutes)());
exports.app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});
exports.app.use(error_middleware_1.errorMiddleware);
//# sourceMappingURL=app.js.map