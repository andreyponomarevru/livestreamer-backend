import { logger } from "../config/logger";
import { Pool } from "pg";
import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} from "./env";

//
// Pg connection
//

// Store the connection pool
let pool: Pool | undefined;

export async function connectDB(): Promise<Pool> {
  if (pool) {
    return pool;
  } else {
    const config = {
      user: POSTGRES_USER,
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      password: POSTGRES_PASSWORD,
      port: POSTGRES_PORT,
    };

    pool = new Pool(config);
    logger.debug("New Postgres connection established");
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
