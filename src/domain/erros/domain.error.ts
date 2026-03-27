export class DomainError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 400,
    ) {
        super(message)
        this.name = 'DomainError'
    }
}

export class NotFoundError extends DomainError {
    constructor(entity: string) {
        super(`${entity} não encontrado`, 404)
    }
}

export class ConflictError extends DomainError {
    constructor(message: string) {
        super(message, 409)
    }
}