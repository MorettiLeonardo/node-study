import jwt from "jsonwebtoken"
import z from "zod"
import { tokenRepository } from "../../../infrastructure/database/repositories/token.repository"

const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string()
})

type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>

interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

class RefreshTokenHandler {
    async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        var parsed = RefreshTokenRequestSchema.safeParse(request)

        if (!parsed.success) {
            throw new Error("Invalid request data: " + parsed.error.message)
        }

        const { refreshToken } = request

        if (!refreshToken) {
            throw new Error("Refresh token not provided")
        }

        let payload: { sub: string; role: string }

        // 1. valida JWT
        try {
            payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!
            ) as { sub: string; role: string }
        } catch {
            throw new Error("Invalid refresh token")
        }

        // 2. valida no banco
        const storedToken = await tokenRepository.findToken(refreshToken)

        if (!storedToken) {
            throw new Error("Refresh token not found")
        }

        // 3. valida expiração
        if (storedToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired")
        }

        // 4. deleta o antigo (rotação)
        await tokenRepository.deleteToken(refreshToken)

        // 5. cria novo refresh token
        const newRefreshToken = jwt.sign(
            { sub: payload.sub, role: payload.role },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        )

        await tokenRepository.createToken(
            payload.sub,
            newRefreshToken
        )

        // 6. gera novo access token
        const newAccessToken = jwt.sign(
            { sub: payload.sub, role: payload.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        )

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }
}

var refreshTokenHandler = new RefreshTokenHandler()

export { refreshTokenHandler }