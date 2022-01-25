import http from "http";

import { expressApp } from "./express-app";
import * as redis from "./config/redis";
import {
  onServerUpgrade,
  onServerError,
  onServerListening,
} from "./event-handlers/http-server-handlers";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);
// During application lifecycle after connecting to the Redis for the first time, I keep the established connection always open. But during integration testing we need to be able to open/close Redis connection between tests to keep everything clean, thus we need this handler
httpServer.on("close", redis.quit);

export { httpServer };
