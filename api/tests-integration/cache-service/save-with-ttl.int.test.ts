import { describe, it, expect, beforeEach } from "@jest/globals";
import { cacheService } from "../../src/services/cache";
import { RedisClient, redisConnection } from "../../src/config/redis";

describe("Cache Service", () => {
  let client: RedisClient;
  beforeEach(async () => (client = await redisConnection.open()));

  const key = "keyName";
  const obj = { one: "value", two: [1, 2, 3] };

  it("saves cache", async () => {
    const response = await cacheService.saveWithTTL(key, obj);

    expect(response).toBe("OK");
    const savedValue = await client.get(key);
    await expect(JSON.parse(savedValue as string)).toStrictEqual(obj);
  });

  it("returns saved cache by key", async () => {
    await client.set(key, JSON.stringify(obj));

    const response = await cacheService.get(key);
    await expect(response).toStrictEqual(obj);
  });
});
