"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'DomainError';
    }
}
exports.DomainError = DomainError;
class NotFoundError extends DomainError {
    constructor(entity) {
        super(`${entity} não encontrado`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends DomainError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=domain.error.js.map