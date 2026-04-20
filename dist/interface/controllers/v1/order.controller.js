"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const create_order_handler_1 = require("src/application/handlers/orders/create-order.handler");
class OrderController {
    async createOrderAsync(req, res) {
        const result = await create_order_handler_1.createOrderHandler.execute(req.body);
        res.status(201).json(result);
    }
}
exports.OrderController = OrderController;
var orderController = new OrderController();
exports.orderController = orderController;
//# sourceMappingURL=order.controller.js.map