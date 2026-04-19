import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userRepository } from "../../../infrastructure/database/repositories/user.repository"
import z from "zod"
import { tokenRepository } from "../../../infrastructure/database/repositories/token.repository"

const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

type LoginRequest = z.infer<typeof LoginRequestSchema>

interface LoginResponse {
    accessToken: string
    refreshToken: string
}

export class LoginHandler {
    private generateTokens(user: { id: string; role: string }) {
        const accessToken = jwt.sign(
            {
                sub: user.id,
                role: user.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        )

        const refreshToken = jwt.sign(
            {
                sub: user.id,
                role: user.role
            },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        )

        return { accessToken, refreshToken }
    }

    async execute(request: LoginRequest): Promise<LoginResponse> {
        var parsed = LoginRequestSchema.safeParse(request)

        if (!parsed.success) {
            throw new Error("Invalid user data: " + parsed.error.message)
        }

        var user = await userRepository.findByEmail(request.email)

        if (!user) {
            throw new Error("Invalid email or password")
        }

        var isPasswordValid = await bcrypt.compare(request.password, user.password)

        if (!isPasswordValid) {
            throw new Error("Invalid email or password")
        }

        await tokenRepository.deleteByUserId(user.id!)

        const { accessToken, refreshToken } = this.generateTokens({ id: user.id!, role: user.role })

        await tokenRepository.createToken(user.id!, refreshToken)

        return { accessToken, refreshToken }
    }
}

var loginHandler = new LoginHandler()

export { loginHandler }