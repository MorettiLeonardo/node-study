import { User } from 'src/domain/entities/user.entity'
import prisma from '../prisma/prisma'

class UserRepository {
    private toUserEntity(data: any): User {
        return new User({
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            role: data.role,
        })
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) return null

        return this.toUserEntity(user)
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) return null

        return this.toUserEntity(user)
    }

    async create(user: User): Promise<User> {
        const createdUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role
            }
        })

        return this.toUserEntity(createdUser)
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data
        })

        return this.toUserEntity(updatedUser)
    }
}

var userRepository = new UserRepository()

export { userRepository }