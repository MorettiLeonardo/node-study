import { Request, Response, NextFunction } from "express"

export function authorizeMiddleware(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user

        if (!user) {
            return res.status(401).json({ message: "Não autenticado" })
        }

        const userRole = String(user.role).toLowerCase()
        const hasPermission = roles
            .map((role) => String(role).toLowerCase())
            .includes(userRole)

        if (!hasPermission) {
            return res.status(403).json({ message: "Sem permissão" })
        }

        next()
    }
}