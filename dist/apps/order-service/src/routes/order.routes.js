"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = orderRoutes;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
function orderRoutes() {
    const router = (0, express_1.Router)();
    router.post("", auth_middleware_1.authMiddleware, order_controller_1.orderController.createOrderAsync);
    return router;
}
