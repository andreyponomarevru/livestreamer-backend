import { afterAll } from "@jest/globals";
import { dbConnection } from "../src/config/postgres";
import { redisConnection } from "../src/config/redis";

afterAll(async () => {
  await dbConnection.close();
  redisConnection.quit();
});
