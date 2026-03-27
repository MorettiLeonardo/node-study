import type { User as MyUser } from '../domain/entities/user.entity'

declare global {
    namespace Express {
        interface User extends MyUser { }
        interface Request {
            user?: MyUser
        }
    }
}