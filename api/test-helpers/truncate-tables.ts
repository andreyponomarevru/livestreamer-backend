import { beforeAll, beforeEach } from "@jest/globals";
import { Pool } from "pg";
import { dbConnection } from "../src/config/postgres";

let pool: Pool;

beforeAll(async () => (pool = await dbConnection.open()));

beforeEach(async () => {
  console.log(
    "[Jest setupFilesAfterEnv Hook] [beforeEach Hook] Truncate *all* tables before each test case",
  );

  await pool.query("TRUNCATE scheduled_broadcast;");
});
