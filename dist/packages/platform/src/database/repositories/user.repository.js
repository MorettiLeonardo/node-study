"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_entity_1 = require("@shared/domain/entities/user.entity");
const auth_prisma_1 = __importDefault(require("../prisma/auth.prisma"));
class UserRepository {
    toUserEntity(data) {
        return new user_entity_1.User({
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            role: data.role,
        });
    }
    async findById(id) {
        const user = await auth_prisma_1.default.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return this.toUserEntity(user);
    }
    async findByEmail(email) {
        const user = await auth_prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        return this.toUserEntity(user);
    }
    async create(user) {
        const createdUser = await auth_prisma_1.default.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
            },
        });
        return this.toUserEntity(createdUser);
    }
    async update(id, data) {
        const updatedUser = await auth_prisma_1.default.user.update({
            where: { id },
            data,
        });
        return this.toUserEntity(updatedUser);
    }
}
const userRepository = new UserRepository();
exports.userRepository = userRepository;
