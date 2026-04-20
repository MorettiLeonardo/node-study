import { Role } from "@prisma/client"
import z from "zod"
import { userRepository } from "../../../infrastructure/database/repositories/user.repository"

const updateUserSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    role: z.nativeEnum(Role)
})

type UpdateUserRequest = z.infer<typeof updateUserSchema>

type UpdateUserResponse = {
    id: string
    name: string
    email: string
    role: Role
}

class UpdateUserHandler {
    async execute(
        id: string,
        data: UpdateUserRequest,
    ): Promise<UpdateUserResponse> {
        var parsed = updateUserSchema.safeParse(data)

        if (!parsed.success) {
            throw new Error("Invalid data: " + parsed.error.message)
        }

        const user = await userRepository.findById(id)

        if (!user) {
            throw new Error("User not found")
        }

        const emailExists = await userRepository.findByEmail(data.email)

        if (emailExists && emailExists.id !== id) {
            throw new Error("Email já em uso")
        }

        const updatedUser = await userRepository.update(id, data)

        return {
            id: updatedUser.id!,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        }
    }
}

export const updateUserHandler = new UpdateUserHandler()