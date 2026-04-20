"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/v1/user.controller"));
function userRoutes() {
    const router = (0, express_1.Router)();
    router.post('/register', user_controller_1.default.register);
    router.put('/update/:id', user_controller_1.default.update);
    return router;
}
//# sourceMappingURL=user.routes.js.map