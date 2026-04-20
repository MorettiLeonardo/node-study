import { Request, Response, NextFunction } from 'express'
import { createUserHandler } from '../../../application/handlers/users/create-user.handler'
import { updateUserHandler } from '../../../application/handlers/users/update-user.handler'

export class UserController {
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await createUserHandler.execute(req.body)

            return res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params
            const user = await updateUserHandler.execute(id.toString(), req.body)
            return res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}

var userController = new UserController()

export default userController