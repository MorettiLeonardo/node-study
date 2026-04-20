"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducer = getProducer;
exports.ensureTopics = ensureTopics;
exports.publishEvent = publishEvent;
exports.createConsumer = createConsumer;
const fs_1 = require("fs");
const kafkajs_1 = require("kafkajs");
let producer = null;
const ensuredTopics = new Set();
function kafkaClient() {
    const brokers = normalizeBrokers(process.env.KAFKA_BROKERS || "localhost:9092");
    const clientId = process.env.KAFKA_CLIENT_ID || "node-study";
    return new kafkajs_1.Kafka({
        clientId,
        brokers: brokers.split(",").map((broker) => broker.trim()),
        logLevel: kafkajs_1.logLevel.NOTHING,
    });
}
function normalizeBrokers(rawBrokers) {
    const runningInDocker = (0, fs_1.existsSync)("/.dockerenv");
    if (runningInDocker) {
        return rawBrokers;
    }
    return rawBrokers
        .split(",")
        .map((broker) => broker.trim())
        .map((broker) => broker.replace(/^kafka:/, "localhost:"))
        .join(",");
}
async function getProducer() {
    if (producer) {
        return producer;
    }
    producer = kafkaClient().producer();
    await producer.connect();
    return producer;
}
async function ensureTopics(topics) {
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
    }
    finally {
        await admin.disconnect();
    }
}
async function publishEvent(topic, type, payload, key) {
    if (!ensuredTopics.has(topic)) {
        await ensureTopics([topic]);
        ensuredTopics.add(topic);
    }
    const event = {
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
async function createConsumer(groupId, topics, handler) {
    const consumer = kafkaClient().consumer({ groupId });
    await consumer.connect();
    for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) {
                return;
            }
            const parsed = JSON.parse(message.value.toString());
            await handler(topic, parsed);
        },
    });
    return consumer;
}
