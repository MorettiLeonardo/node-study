import { Queue } from "bullmq"
import { mailRegistrationJob } from "src/jobs/MailRegistration"
import { redisConnection } from "src/config/redistConnection"

export const mailQueue = new Queue(mailRegistrationJob.name, { connection: redisConnection })
