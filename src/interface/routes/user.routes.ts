import { Router } from "express"
import userController from "../controllers/v1/user.controller"

export function userRoutes(): Router {
    const router = Router()

    router.post('/register', userController.register)
    router.put('/update/:id', userController.update)

    return router
}