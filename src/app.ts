import express from 'express'
import cors from 'cors'
import { userRoutes } from './interface/routes/user.routes'
import { errorMiddleware } from './interface/middleware/error.middleware'
import { authRoutes } from './interface/routes/auth.routes'
import { orderoutes } from './interface/routes/order.routes'
import { productRoutes } from './interface/routes/product.routes'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes())
app.use('/auth', authRoutes())
app.use('/order', orderoutes())
app.use('/product', productRoutes())

app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' })
})

app.use(errorMiddleware)