import IORedis from "ioredis"
import "dotenv/config"

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    maxRetriesPerRequest: null,
})

export { redisConnection }