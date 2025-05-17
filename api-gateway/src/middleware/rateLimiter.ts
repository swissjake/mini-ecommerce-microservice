import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis";
import { RedisReply } from "rate-limit-redis";

// 100 requests per 15 minutes per IP
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]): Promise<RedisReply> =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  }),
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});
