import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

import { HTTP_PORT } from "./config/env";
import { httpServer } from "./http-server";
import { serverOptions } from "./config/ws-server";

import {
  onUncaughtException,
  onUnhandledRejection,
  onWarning,
} from "./event-handlers/process-handlers";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(HTTP_PORT);

export { httpServer };
