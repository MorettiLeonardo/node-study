import { Queue } from "bullmq"
import { mailRegistrationJob } from "src/jobs/MailRegistration"
import { redisConnection } from "src/config/redistConnection"

export const queue = new Queue(mailRegistrationJob.name, { connection: redisConnection })
