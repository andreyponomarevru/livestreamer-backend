import { redisConnection } from "../../config/redis";

export const cacheService = {
  saveWithTTL: async function <Value>(
    key: string,
    value: Value,
    ttlSeconds = 60,
  ): Promise<string | null> {
    const client = await redisConnection.open();
    const r = await client.set(key, JSON.stringify(value));
    await client.expire(key, ttlSeconds);
    return r;
  },

  get: async function <Value>(key: string): Promise<Value | void> {
    const client = await redisConnection.open();
    const jsonString = await client.get(key);

    if (jsonString) {
      return JSON.parse(jsonString);
    }
  },
};
