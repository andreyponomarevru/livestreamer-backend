import { logger } from "../config/logger";
import { Pool } from "pg";
import { env } from "./env";

let pool: Pool | undefined;

export async function connectDB(): Promise<Pool> {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({
      user: env.POSTGRES_USER,
      host: env.POSTGRES_HOST,
      database: env.POSTGRES_DATABASE,
      password: env.POSTGRES_PASSWORD,
      port: env.POSTGRES_PORT,
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
