"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = exports.CreateUserHandler = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_2 = require("@platform/messaging/kafka/client");
const mail_queue_1 = require("@platform/messaging/queues/mail.queue");
const user_repository_1 = require("@platform/database/repositories/user.repository");
const user_entity_1 = require("@shared/domain/entities/user.entity");
const zod_1 = __importDefault(require("zod"));
const createUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
class CreateUserHandler {
    async execute(request) {
        const parsed = createUserSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }
        const existingUser = await user_repository_1.userRepository.findByEmail(parsed.data.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        const hash = await bcrypt_1.default.hash(parsed.data.password, 10);
        const user = new user_entity_1.User({
            name: parsed.data.name,
            email: parsed.data.email,
            password: hash,
            role: client_1.Role.USER,
        });
        const createdUser = await user_repository_1.userRepository.create(user);
        const mailData = {
            to: user.email,
            subject: "Welcome to our platform!",
            text: `Hello ${user.name}, welcome to our platform! Your account has been created successfully.`,
        };
        await mail_queue_1.mailQueue.add("send-registration-email", mailData);
        await (0, client_2.publishEvent)("user.created", "UserCreated", {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
            createdAt: createdUser.createdAt?.toISOString(),
        }, createdUser.id);
        return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            role: createdUser.role,
        };
    }
}
exports.CreateUserHandler = CreateUserHandler;
const createUserHandler = new CreateUserHandler();
exports.createUserHandler = createUserHandler;
