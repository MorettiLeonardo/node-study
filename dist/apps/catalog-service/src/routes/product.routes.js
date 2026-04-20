"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = productRoutes;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_1 = require("../middleware/authorize");
function productRoutes() {
    const router = (0, express_1.Router)();
    router.post("", auth_middleware_1.authMiddleware, (0, authorize_1.authorizeMiddleware)("ADMIN"), product_controller_1.productController.createProduct);
    router.post("/internal/by-ids", product_controller_1.productController.getByIds);
    return router;
}
