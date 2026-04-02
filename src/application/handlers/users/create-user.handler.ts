import { Role } from "@prisma/client"
import bcrypt from "bcrypt"
import { User } from "src/domain/entities/user.entity"
import { userRepository } from "src/infrastructure/database/repositories/user.repository"
import { mailQueue } from "src/infrastructure/messaging/queue/queue"
import z from "zod"

const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
})

type CreateUserRequest = z.infer<typeof createUserSchema>;

type CreateUserResponse = {
    id: string
    name: string
    email: string
    role: Role
    createdAt?: Date
}

export class CreateUserHandler {
    async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        var parsed = createUserSchema.safeParse(request)

        if (!parsed.success) {
            throw new Error(parsed.error.message)
        }

        var existingUser = await userRepository.findByEmail(parsed.data.email)

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        var hash = await bcrypt.hash(parsed.data.password, 10)

        var user = new User({
            name: parsed.data.name,
            email: parsed.data.email,
            password: hash,
            role: Role.USER
        })

        const createdUser = await userRepository.create(user)

        await mailQueue.add("send-email", {
            to: user.email,
            subject: "Bem-vindo!",
            text: "Sua conta foi criada 🚀",
        })

        return {
            id: createdUser.id!,
            name: createdUser.name,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            role: createdUser.role
        }
    }
}

var createUserHandler = new CreateUserHandler()

export { createUserHandler }