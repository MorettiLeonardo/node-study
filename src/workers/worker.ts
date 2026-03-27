import { Worker } from "bullmq"
import IORedis from "ioredis"
import { sendEmail } from "src/application/external-services/email.service"

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
})

new Worker(
    "fila",
    async (job) => {
        if (job.name === "send-email") {
            const { to, subject, text } = job.data

            console.log("📧 Enviando email pra:", to)

            await sendEmail(to, subject, text)
        }
    },
    { connection }
)

console.log("Worker rodando...")