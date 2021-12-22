import { createNodeRedisClient, WrappedNodeRedisClient } from "handy-redis";

import { logger } from "./logger";
import { REDIS_PORT, REDIST_HOST } from "./env";

let client: WrappedNodeRedisClient | undefined;

export function connectDB(): WrappedNodeRedisClient {
  if (client) {
    logger.debug(`${__filename} Used existing Redis connection`);

    return client;
  } else {
    client = createNodeRedisClient(REDIS_PORT, REDIST_HOST);
    client.nodeRedis.on("error", (err: Error) => {
      logger.error(`${__filename} [error] ${err}`);
    });
    logger.debug("Redis connection is successfully established");
    return client;
  }
}

export function end(): void {
  if (client) client.end(true);
  client = undefined;

  logger.error("Redis connection was forcibly closed");
}

export function quit(): void {
  if (client) client.quit();
  client = undefined;

  logger.debug("Redis connection closed cleanly");
}
