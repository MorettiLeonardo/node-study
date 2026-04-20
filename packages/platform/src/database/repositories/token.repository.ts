import crypto from "crypto";
import authPrisma from "../prisma/auth.prisma";

class TokenRepository {
  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async createToken(userId: string, token: string) {
    await authPrisma.refreshToken.create({
      data: {
        userId,
        token: this.hashToken(token),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async findToken(token: string) {
    return await authPrisma.refreshToken.findUnique({
      where: { token: this.hashToken(token) },
    });
  }

  async deleteToken(token: string) {
    await authPrisma.refreshToken.delete({
      where: { token: this.hashToken(token) },
    });
  }

  async deleteByUserId(userId: string) {
    await authPrisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}

const tokenRepository = new TokenRepository();

export { tokenRepository };
