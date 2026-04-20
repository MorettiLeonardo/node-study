"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
function userRoutes() {
    const router = (0, express_1.Router)();
    router.post("/register", user_controller_1.default.register);
    router.put("/update/:id", user_controller_1.default.update);
    router.get("/internal/:id", user_controller_1.default.getInternalById);
    return router;
}
