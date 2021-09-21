import util from "util";

import { logger } from "./config/logger";
import { HTTP_PORT } from "./config/env";
import { httpServer } from "./http-server";
import * as dbConnection from "./config/postgres";

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

//

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(HTTP_PORT);

export { httpServer };
