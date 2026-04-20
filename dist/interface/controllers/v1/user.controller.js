"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const create_user_handler_1 = require("src/application/handlers/users/create-user.handler");
const update_user_handler_1 = require("src/application/handlers/users/update-user.handler");
class UserController {
    async register(req, res, next) {
        try {
            const user = await create_user_handler_1.createUserHandler.execute(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const user = await update_user_handler_1.updateUserHandler.execute(id.toString(), req.body);
            return res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
var userController = new UserController();
exports.default = userController;
//# sourceMappingURL=user.controller.js.map