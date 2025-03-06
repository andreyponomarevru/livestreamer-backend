import * as env from "./config/env";

import { httpServer } from "./http-server";
import {
  onUncaughtException,
  onUnhandledRejection,
  onWarning,
} from "./node-process-event-handlers";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(env.HTTP_PORT);
