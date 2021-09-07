import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import wav from "wav";

import { env } from "./config/env";
import { httpServer } from "./http-server-config";

import {
  onUncaughtException,
  onUnhandledRejection,
} from "./event-handlers/errors";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

httpServer.listen(env.HTTP_PORT);

export { httpServer };
