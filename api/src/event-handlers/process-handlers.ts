import util from "util";

import { logger } from "../config/logger";
import * as dbConnection from "../config/postgres";

export function onWarning(err: Error): void {
  logger.error(err.stack);
}

export function onUncaughtException(err: Error): void {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  dbConnection.close();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: unknown): void {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}
