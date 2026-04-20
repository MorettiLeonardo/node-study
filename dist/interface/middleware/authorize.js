"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeMiddleware = authorizeMiddleware;
function authorizeMiddleware(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Não autenticado" });
        }
        const userRole = String(user.role).toLowerCase();
        const hasPermission = roles
            .map((role) => String(role).toLowerCase())
            .includes(userRole);
        if (!hasPermission) {
            return res.status(403).json({ message: "Sem permissão" });
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map