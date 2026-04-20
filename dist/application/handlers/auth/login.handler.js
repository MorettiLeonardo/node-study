"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.LoginHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_repository_1 = require("src/infrastructure/database/repositories/token.repository");
const user_repository_1 = require("src/infrastructure/database/repositories/user.repository");
const zod_1 = __importDefault(require("zod"));
const LoginRequestSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
class LoginHandler {
    generateTokens(user) {
        const accessToken = jsonwebtoken_1.default.sign({
            sub: user.id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({
            sub: user.id,
            role: user.role
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
    async execute(request) {
        var parsed = LoginRequestSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error("Invalid user data: " + parsed.error.message);
        }
        var user = await user_repository_1.userRepository.findByEmail(request.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        var isPasswordValid = await bcrypt_1.default.compare(request.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        await token_repository_1.tokenRepository.deleteByUserId(user.id);
        const { accessToken, refreshToken } = this.generateTokens({ id: user.id, role: user.role });
        await token_repository_1.tokenRepository.createToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }
}
exports.LoginHandler = LoginHandler;
var loginHandler = new LoginHandler();
exports.loginHandler = loginHandler;
//# sourceMappingURL=login.handler.js.map