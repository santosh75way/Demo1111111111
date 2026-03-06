import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  // Don't connect immediately — connect only when first used
  lazyConnect: true,
  // Stop ioredis from retrying forever when Redis is unavailable
  maxRetriesPerRequest: 0,
  retryStrategy: () => null,          // disable automatic reconnect
  enableOfflineQueue: false,          // fail fast instead of queuing commands
});

// Swallow unhandled connection errors so the process doesn't crash
redis.on("error", (err: Error) => {
  console.warn("[Redis] Connection error (non-fatal):", err.message);
});