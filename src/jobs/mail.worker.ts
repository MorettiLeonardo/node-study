import { Worker } from "bullmq"
import { sendEmail } from "src/application/external-services/email.service"
import { redisConnection } from "src/config/redistConnection"

new Worker(
  "mail",
  async (job) => {
    switch (job.name) {
      case "send-registration-email": {
        const { to, subject, text } = job.data
        await sendEmail(to, subject, text)
        break
      }

      default:
        throw new Error(`Unknown job: ${job.name}`)
    }
  },
  {
    connection: redisConnection,
    concurrency: 10
  }
)

console.log("📬 Mail worker rodando...")