import { Role } from "@prisma/client"
import bcrypt from "bcrypt"
import z from "zod"
import { userRepository } from "../../../infrastructure/database/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { mailQueue } from "../../../infrastructure/messaging/queues/mail.queue";

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

        const mailData = {
            to: user.email,
            subject: "Welcome to our platform!",
            text: `Hello ${user.name}, welcome to our platform! Your account has been created successfully.`
        }

        await mailQueue.add("send-registration-email", mailData)

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