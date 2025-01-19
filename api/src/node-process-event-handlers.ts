import util from "util";
import { logger } from "./config/logger";
import { dbConnection } from "./config/postgres";
import { redisConnection } from "./config/redis";

export function onWarning(err: Error) {
  logger.warn(err.stack);
}

export function onUncaughtException(err: Error) {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  dbConnection.close();
  redisConnection.quit();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: Promise<Error>) {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}
