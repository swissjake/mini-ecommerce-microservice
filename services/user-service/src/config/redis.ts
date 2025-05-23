import Redis from "ioredis";
import logger from "../utils/logger";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redis.on("connect", () => {
  logger.info("User Service connected to Redis");
});

redis.on("error", (error) => {
  logger.error("User Service Redis connection error:", error);
});

export default redis;
