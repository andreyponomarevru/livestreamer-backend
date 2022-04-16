import * as env from "./config/env";
import { httpServer } from "./http-server";
import {
  onUnhandledRejection,
  onUncaughtException,
  onWarning,
} from "./event-handlers/node-process-handlers";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(env.HTTP_PORT);
