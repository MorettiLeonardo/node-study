"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = productRoutes;
const express_1 = require("express");
const product_controlle_1 = require("../controllers/v1/product.controlle");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_1 = require("../middleware/authorize");
function productRoutes() {
    const router = (0, express_1.Router)();
    router.post('', auth_middleware_1.authMiddleware, (0, authorize_1.authorizeMiddleware)('ADMIN'), product_controlle_1.productController.createProduct);
    return router;
}
//# sourceMappingURL=product.routes.js.map