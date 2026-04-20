"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderoutes = orderoutes;
const express_1 = require("express");
const order_controller_1 = require("../controllers/v1/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
function orderoutes() {
    const router = (0, express_1.Router)();
    router.post('', auth_middleware_1.authMiddleware, order_controller_1.orderController.createOrderAsync);
    return router;
}
//# sourceMappingURL=order.routes.js.map