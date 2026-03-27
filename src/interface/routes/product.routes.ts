import { Router } from "express"
import { productController } from "../controllers/v1/product.controlle"
import { authMiddleware } from "../middleware/auth.middleware"
import { authorizeMiddleware } from "../middleware/authorize"

export function productRoutes(): Router {
    const router = Router()

    router.post('', authMiddleware, authorizeMiddleware('ADMIN'), productController.createProduct)

    return router
}