import { Worker } from "bullmq"
import { sendEmail } from "src/application/external-services/email.service"
import { redisConnection } from "src/config/redistConnection"

var mailRegistrationJob = new Worker(
    "MailRegistration",
    async (job) => {
        const { to, subject, text } = job.data

        await sendEmail(to, subject, text)
    },
    { connection: redisConnection }
)

export { mailRegistrationJob }
