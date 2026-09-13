import Redis from "ioredis";
import { env } from "../config/env";

const redisConfig = {
  host: env.redisHost || "127.0.0.1",
  port: Number(env.redisPort) || 6379,
  maxRetriesPerRequest: 3,
};

export const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});
