"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/v1/auth.controller"));
function authRoutes() {
    const router = (0, express_1.Router)();
    router.post('/login', auth_controller_1.default.login);
    router.post('/refresh-token', auth_controller_1.default.refreshTokenController);
    return router;
}
//# sourceMappingURL=auth.routes.js.map