import jwt from "jsonwebtoken";
import { tokenRepository } from "../../database/repositories/token.repository";
import z from "zod";

const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

class RefreshTokenHandler {
  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const parsed = RefreshTokenRequestSchema.safeParse(request);

    if (!parsed.success) {
      throw new Error("Invalid request data: " + parsed.error.message);
    }

    const { refreshToken } = request;

    if (!refreshToken) {
      throw new Error("Refresh token not provided");
    }

    let payload: { sub: string; role: string };

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        sub: string;
        role: string;
      };
    } catch {
      throw new Error("Invalid refresh token");
    }

    const storedToken = await tokenRepository.findToken(refreshToken);

    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token expired");
    }

    await tokenRepository.deleteToken(refreshToken);

    const newRefreshToken = jwt.sign(
      { sub: payload.sub, role: payload.role },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    await tokenRepository.createToken(payload.sub, newRefreshToken);

    const newAccessToken = jwt.sign(
      { sub: payload.sub, role: payload.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

const refreshTokenHandler = new RefreshTokenHandler();

export { refreshTokenHandler };
