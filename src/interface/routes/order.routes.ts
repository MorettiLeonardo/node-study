import { Router } from "express"
import { orderController } from "../controllers/v1/order.controller"
import { authMiddleware } from "../middleware/auth.middleware"

export function orderoutes(): Router {
    const router = Router()

    router.post('', authMiddleware, orderController.createOrderAsync)

    return router
}