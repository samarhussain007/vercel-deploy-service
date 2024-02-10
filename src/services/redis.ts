import { Redis } from "ioredis";

const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10); // Default to 6379 if not set
const redisHost = process.env.REDIS_HOST || "localhost";

export const redisConnection = new Redis(redisPort, redisHost, {
  maxRetriesPerRequest: null,
});
