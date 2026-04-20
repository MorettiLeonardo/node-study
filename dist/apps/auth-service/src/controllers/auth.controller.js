"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_handler_1 = require("../handlers/auth/login.handler");
const refresh_token_handler_1 = require("../handlers/auth/refresh-token.handler");
class AuthController {
    async login(req, res) {
        const result = await login_handler_1.loginHandler.execute(req.body);
        return res.status(200).json(result);
    }
    async refreshTokenController(req, res) {
        const result = await refresh_token_handler_1.refreshTokenHandler.execute(req.body);
        return res.status(200).json(result);
    }
}
exports.AuthController = AuthController;
const authController = new AuthController();
exports.default = authController;
