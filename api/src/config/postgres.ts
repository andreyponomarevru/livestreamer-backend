import { Pool, PoolConfig } from "pg";
import { logger } from "../config/logger";
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "./env";

//
// Pg connection
//

export const POOL_CONFIG: PoolConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
};

//
// Migrations config (node-pg-migrate)
//

export const PG_MIGRATION_CONFIG = {
  databaseUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  migrationsTable: "pgmigrations",
  dir: "./src/migrations",
};

// Store the connection pool
let pool: Pool | undefined;

export const dbConnection = {
  open: async function (config: PoolConfig = POOL_CONFIG): Promise<Pool> {
    if (pool) {
      return pool;
    } else {
      pool = new Pool(config);
      logger.debug("New Postgres connection established");
      return pool;
    }
  },

  // Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
  close: async function (): Promise<void> {
    if (pool) {
      await pool.end();
    }

    pool = undefined;
    logger.debug("Pool has ended");
  },
};
