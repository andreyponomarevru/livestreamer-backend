import * as redis from "../../config/redis";

export async function saveWithTTL<Value>(
  key: string,
  value: Value,
  ttlSeconds = 60,
): Promise<string | null> {
  const client = redis.connectDB();
  const r = await client.set(key, JSON.stringify(value));
  await client.expire(key, ttlSeconds);
  return r;
}

export async function get<Value>(key: string): Promise<Value | void> {
  const client = redis.connectDB();
  const jsonString = await client.get(key);

  if (jsonString) {
    return JSON.parse(jsonString);
  }
}
