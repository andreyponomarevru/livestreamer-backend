import { logger } from "../config/logger";
import { Pool, types } from "pg";
import {
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "./env";

//
// Custom timestamp parsing
//
// Doc: https://github.com/brianc/node-pg-types

// When we fetch timezone from postgres, 'pg' driver implicitly converts all timestamps to 'Date' object and that results in timestamps being converted to LOCAL timezone. So, in order to prevent this implicit convertion, and preserve the original UTC timestamp without timezone we need to use our own timestamp parser — it will fetch timestamps as is i.e. as regular strings:
function parseTimestamp(val: string) {
  return val === null ? null : val;
}
// 'TIMESTAMPT' is 'timestamp without time zone'.
types.setTypeParser(types.builtins.TIMESTAMP, parseTimestamp);

//
// Pg connection
//

// Store the connection pool
let pool: Pool | undefined;

export async function connectDB(): Promise<Pool> {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({
      user: POSTGRES_USER,
      host: POSTGRES_HOST,
      database: POSTGRES_DATABASE,
      password: POSTGRES_PASSWORD,
      port: POSTGRES_PORT,
    });
    return pool;
  }
}

// Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
export async function close(): Promise<void> {
  if (pool) {
    await pool.end();
  }

  pool = undefined;
  logger.debug("Pool has ended");
}
