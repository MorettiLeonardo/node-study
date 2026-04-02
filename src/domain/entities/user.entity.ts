import { Role } from "@prisma/client"

interface UserProps {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date
    updatedAt?: Date
    role: Role
}

export class User {
    private props: UserProps

    constructor(props: UserProps) {
        this.props = props
    }

    get id() {
        return this.props.id
    }

    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get role() {
        return this.props.role
    }
}