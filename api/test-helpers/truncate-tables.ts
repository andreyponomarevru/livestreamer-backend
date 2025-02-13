import { beforeEach } from "@jest/globals";
import { dbConnection } from "../src/config/postgres";
import { redisConnection } from "../src/config/redis";

const tablesToTruncate = [
  "scheduled_broadcast",
  "broadcast_like",
  "appuser_bookmark",
  "broadcast",
  "chat_message_like",
  "chat_message",
  "appuser_setting",
  "appuser",
].join(", ");

// Truncates tables before each test case
beforeEach(async () => {
  const pool = await dbConnection.open();
  await pool.query(`TRUNCATE ${tablesToTruncate} RESTART IDENTITY CASCADE`);

  const client = await redisConnection.open();
  await client.flushAll();
});
