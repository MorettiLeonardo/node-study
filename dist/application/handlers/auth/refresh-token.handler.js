"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_repository_1 = require("src/infrastructure/database/repositories/token.repository");
const zod_1 = __importDefault(require("zod"));
const RefreshTokenRequestSchema = zod_1.default.object({
    refreshToken: zod_1.default.string()
});
class RefreshTokenHandler {
    async execute(request) {
        var parsed = RefreshTokenRequestSchema.safeParse(request);
        if (!parsed.success) {
            throw new Error("Invalid request data: " + parsed.error.message);
        }
        const { refreshToken } = request;
        if (!refreshToken) {
            throw new Error("Refresh token not provided");
        }
        let payload;
        // 1. valida JWT
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch {
            throw new Error("Invalid refresh token");
        }
        // 2. valida no banco
        const storedToken = await token_repository_1.tokenRepository.findToken(refreshToken);
        if (!storedToken) {
            throw new Error("Refresh token not found");
        }
        // 3. valida expiração
        if (storedToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired");
        }
        // 4. deleta o antigo (rotação)
        await token_repository_1.tokenRepository.deleteToken(refreshToken);
        // 5. cria novo refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({ sub: payload.sub, role: payload.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        await token_repository_1.tokenRepository.createToken(payload.sub, newRefreshToken);
        // 6. gera novo access token
        const newAccessToken = jsonwebtoken_1.default.sign({ sub: payload.sub, role: payload.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}
var refreshTokenHandler = new RefreshTokenHandler();
exports.refreshTokenHandler = refreshTokenHandler;
//# sourceMappingURL=refresh-token.handler.js.map