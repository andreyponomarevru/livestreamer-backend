import util from "util";

import { logger } from "./config/logger";
import * as postgresConnection from "./config/postgres";
import * as redisConnection from "./config/redis";
import * as env from "./config/env";
import { httpServer } from "./http-server";

function onWarning(err: Error) {
  logger.error(err.stack);
}

function onUncaughtException(err: Error) {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  postgresConnection.close();
  redisConnection.quit();
  process.exit(1);
}

function onUnhandledRejection(reason: string, p: unknown) {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(env.HTTP_PORT);
