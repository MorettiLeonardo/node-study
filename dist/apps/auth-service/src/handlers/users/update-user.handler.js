"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserHandler = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@platform/messaging/kafka/client");
const user_repository_1 = require("@platform/database/repositories/user.repository");
const zod_1 = __importDefault(require("zod"));
const updateUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(255),
    email: zod_1.default.string().email(),
    role: zod_1.default.nativeEnum(client_1.Role),
});
class UpdateUserHandler {
    async execute(id, data) {
        const parsed = updateUserSchema.safeParse(data);
        if (!parsed.success) {
            throw new Error("Invalid data: " + parsed.error.message);
        }
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const emailExists = await user_repository_1.userRepository.findByEmail(data.email);
        if (emailExists && emailExists.id !== id) {
            throw new Error("Email já em uso");
        }
        const updatedUser = await user_repository_1.userRepository.update(id, data);
        await (0, client_2.publishEvent)("user.updated", "UserUpdated", {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        }, updatedUser.id);
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        };
    }
}
const updateUserHandler = new UpdateUserHandler();
exports.updateUserHandler = updateUserHandler;
