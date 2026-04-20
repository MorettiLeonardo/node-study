"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const create_user_handler_1 = require("../handlers/users/create-user.handler");
const get_user_by_id_handler_1 = require("../handlers/users/get-user-by-id.handler");
const update_user_handler_1 = require("../handlers/users/update-user.handler");
class UserController {
    async register(req, res, next) {
        try {
            const user = await create_user_handler_1.createUserHandler.execute(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            return next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const user = await update_user_handler_1.updateUserHandler.execute(String(id), req.body);
            return res.status(200).json(user);
        }
        catch (error) {
            return next(error);
        }
    }
    async getInternalById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await get_user_by_id_handler_1.getUserByIdHandler.execute(String(id));
            return res.status(200).json(user);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UserController = UserController;
const userController = new UserController();
exports.default = userController;
