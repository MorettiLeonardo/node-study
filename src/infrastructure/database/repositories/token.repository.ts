import crypto from "crypto"
import prisma from "../prisma/prisma";

class TokenRepository {
    private hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex")
    }

    async createToken(userId: string, token: string) {
        await prisma.refreshToken.create({
            data: {
                userId,
                token: this.hashToken(token),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        })
    }

    async findToken(token: string) {
        return await prisma.refreshToken.findUnique({
            where: { token: this.hashToken(token) }
        })
    }

    async deleteToken(token: string) {
        await prisma.refreshToken.delete({
            where: { token: this.hashToken(token) }
        })
    }

    async deleteByUserId(userId: string) {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        })
    }
}

var tokenRepository = new TokenRepository()

export { tokenRepository }