import { Queue } from "bullmq";
import { redisConnection } from "../../infra/redisConnection";

export const mailQueue = new Queue("mail", {
  connection: redisConnection,
});

mailQueue.on("error", (error) => {
  console.error("Mail Queue Error:", error);
});
