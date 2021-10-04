import util from "util";

import { logger } from "./config/logger";
import * as dbConnection from "./config/postgres";
import * as env from "./config/env";
import { httpServer } from "./http-server";

function onWarning(err: Error) {
  logger.error(err.stack);
}

function onUncaughtException(err: Error) {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  dbConnection.close();
  process.exit(1);
}

function onUnhandledRejection(reason: string, p: unknown) {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

logger.debug(env);
httpServer.listen(env.HTTP_PORT);
