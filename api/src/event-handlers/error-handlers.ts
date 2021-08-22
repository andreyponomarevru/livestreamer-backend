import util from "util";

import { env } from "./../config/env";
import { logger } from "./../config/logger";
import * as dbConnection from "./../config/postgres";

// TODO: find a better place for this function, it shouldnt be here
export function onServerListening(): void {
  logger.debug(
    `${__filename}: API HTTP Server is listening on port ${env.HTTP_PORT}`,
  );
}

//
// Error handlers
//

export function onUncaughtException(err: Error): void {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  dbConnection.close();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: unknown): void {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}

export function onServerError(err: NodeJS.ErrnoException): void | never {
  if (err.syscall !== "listen") throw err;

  const bind =
    typeof env.HTTP_PORT === "string"
      ? `Pipe ${env.HTTP_PORT}`
      : `Port ${env.HTTP_PORT}`;

  // Messages for listen errors
  switch (err.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}
