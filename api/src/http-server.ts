/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import http from "http";
import { Socket } from "net";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { expressApp } from "./express-app";
import { redisConnection } from "./config/redis";
import { wsServer } from "./ws-server";
import { WSChatClient } from "./services/ws";
import { HTTP_PORT } from "./config/env";
import { logger } from "./config/logger";
import { sessionParser } from "./express-app";
import {
  onServerListening,
  onServerError,
  onServerUpgrade,
} from "./http-server-event-handlers";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);
// During application lifecycle after connecting to the Redis for the first time, I keep the established connection always open. But during integration testing we need to be able to open/close Redis connection between tests to keep everything clean, thus we need this handler
httpServer.on("close", redisConnection.quit);

export { httpServer };
