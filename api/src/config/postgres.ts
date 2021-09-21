import { logger } from "../config/logger";
import { Pool } from "pg";
import {
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "./env";

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
