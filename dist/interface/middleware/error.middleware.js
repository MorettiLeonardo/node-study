"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const domain_error_1 = require("src/domain/erros/domain.error");
const zod_1 = require("zod");
function errorMiddleware(err, req, res, next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors: err.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }
    if (err instanceof domain_error_1.ConflictError) {
        return res.status(409).json({
            message: err.message
        });
    }
    if (err instanceof Error) {
        return res.status(400).json({
            message: err.message
        });
    }
    return res.status(500).json({
        message: 'Erro interno do servidor'
    });
}
//# sourceMappingURL=error.middleware.js.map