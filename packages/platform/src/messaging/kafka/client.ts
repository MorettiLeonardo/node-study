import { existsSync } from "fs";
import { Consumer, Kafka, logLevel, Producer } from "kafkajs";

type DomainEvent<T = unknown> = {
  type: string;
  payload: T;
  occurredAt: string;
};

let producer: Producer | null = null;
const ensuredTopics = new Set<string>();

function kafkaClient() {
  const brokers = normalizeBrokers(process.env.KAFKA_BROKERS || "localhost:9092");
  const clientId = process.env.KAFKA_CLIENT_ID || "node-study";

  return new Kafka({
    clientId,
    brokers: brokers.split(",").map((broker) => broker.trim()),
    logLevel: logLevel.NOTHING,
  });
}

function normalizeBrokers(rawBrokers: string): string {
  const runningInDocker = existsSync("/.dockerenv");

  if (runningInDocker) {
    return rawBrokers;
  }

  return rawBrokers
    .split(",")
    .map((broker) => broker.trim())
    .map((broker) => broker.replace(/^kafka:/, "localhost:"))
    .join(",");
}

export async function getProducer() {
  if (producer) {
    return producer;
  }

  producer = kafkaClient().producer();
  await producer.connect();
  return producer;
}

export async function ensureTopics(topics: string[]) {
  const admin = kafkaClient().admin();
  await admin.connect();

  try {
    await admin.createTopics({
      waitForLeaders: true,
      topics: topics.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
  } finally {
    await admin.disconnect();
  }
}

export async function publishEvent<T>(topic: string, type: string, payload: T, key?: string) {
  if (!ensuredTopics.has(topic)) {
    await ensureTopics([topic]);
    ensuredTopics.add(topic);
  }

  const event: DomainEvent<T> = {
    type,
    payload,
    occurredAt: new Date().toISOString(),
  };

  const kafkaProducer = await getProducer();
  await kafkaProducer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(event),
      },
    ],
  });
}

export async function createConsumer(
  groupId: string,
  topics: string[],
  handler: (topic: string, event: DomainEvent) => Promise<void>,
) {
  const consumer: Consumer = kafkaClient().consumer({ groupId });
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) {
        return;
      }

      const parsed = JSON.parse(message.value.toString()) as DomainEvent;
      await handler(topic, parsed);
    },
  });

  return consumer;
}
