import { Queue } from "bullmq"
import { redisConnection } from "../../../config/redistConnection"

export const orderQueue = new Queue("order", {
  connection: redisConnection,
})