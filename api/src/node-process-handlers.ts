import util from "util";
import { logger } from "./config/logger";
import * as postgresConnection from "./config/postgres";
import * as redisConnection from "./config/redis";

export function onWarning(err: Error) {
  logger.warn(err.stack);
}

export function onUncaughtException(err: Error) {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  postgresConnection.close();
  redisConnection.quit();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: Promise<Error>) {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}
