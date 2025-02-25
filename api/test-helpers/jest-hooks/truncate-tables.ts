import { beforeEach } from "@jest/globals";
import { dbConnection } from "../../src/config/postgres";
import { redisConnection } from "../../src/config/redis";
import { logger } from "../../src/config/logger";

const tablesToTruncate = [
  "scheduled_broadcast",
  "broadcast_like",
  "appuser_bookmark",
  "broadcast",
  "chat_message_like",
  "chat_message",
  "appuser_setting",
  "appuser",
];

async function truncateDBTables(tableNames: string[]) {
  const pool = await dbConnection.open();
  await pool.query(
    `TRUNCATE ${tableNames.join(", ")} RESTART IDENTITY CASCADE`,
  );
}

async function deleteAllRedisKeys() {
  const client = await redisConnection.open();
  await client.flushAll();
}

beforeEach(async () => {
  await truncateDBTables(tablesToTruncate);
  await deleteAllRedisKeys();
  logger.silent = true;
});
