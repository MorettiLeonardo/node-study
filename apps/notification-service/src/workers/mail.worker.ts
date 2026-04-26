import { redisConnection } from "../infra/redisConnection";
import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";

new Worker(
  "mail",
  async (job) => {
    switch (job.name) {
      case "send-registration-email": {
        const { to, subject, text } = job.data;
        await sendEmail(to, subject, text);
        break;
      }
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  },
);

console.log("notification-service mail worker running");
