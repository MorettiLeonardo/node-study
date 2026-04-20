"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRepository = void 0;
const crypto_1 = __importDefault(require("crypto"));
const auth_prisma_1 = __importDefault(require("../prisma/auth.prisma"));
class TokenRepository {
    hashToken(token) {
        return crypto_1.default.createHash("sha256").update(token).digest("hex");
    }
    async createToken(userId, token) {
        await auth_prisma_1.default.refreshToken.create({
            data: {
                userId,
                token: this.hashToken(token),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    }
    async findToken(token) {
        return await auth_prisma_1.default.refreshToken.findUnique({
            where: { token: this.hashToken(token) },
        });
    }
    async deleteToken(token) {
        await auth_prisma_1.default.refreshToken.delete({
            where: { token: this.hashToken(token) },
        });
    }
    async deleteByUserId(userId) {
        await auth_prisma_1.default.refreshToken.deleteMany({
            where: { userId },
        });
    }
}
const tokenRepository = new TokenRepository();
exports.tokenRepository = tokenRepository;
