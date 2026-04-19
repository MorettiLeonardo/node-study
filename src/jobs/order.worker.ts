import { Worker } from "bullmq"
import { orderRepository } from "../infrastructure/database/repositories/order.repository"
import { redisConnection } from "../config/redistConnection"

new Worker(
  "order",
  async (job) => {
    switch (job.name) {
      case "create-order": {

        const { userId, items } = job.data

        await orderRepository.create(userId, items)

        break
      }

      default:
        throw new Error("Job não encontrado")
    }
  },
  {
    connection: redisConnection,
  }
)