"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdHandler = void 0;
const user_repository_1 = require("@platform/database/repositories/user.repository");
class GetUserByIdHandler {
    async execute(id) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
const getUserByIdHandler = new GetUserByIdHandler();
exports.getUserByIdHandler = getUserByIdHandler;
