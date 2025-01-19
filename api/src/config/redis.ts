import { createClient, RedisClientType } from "redis";
import { logger } from "./logger";
import { REDIS_URI } from "./env";

let client: RedisClientType | undefined;

export const redisConnection = {
  open: async function () {
    function handleErr(err: Error) {
      logger.error(`${__filename} [error] Redis Client Error: ${err}`);
    }

    function handleConnect() {
      logger.info("Connected to Redis");
    }

    function handleReconnecting() {
      logger.info("Reconnecting to Redis ...");
    }

    if (client) {
      logger.debug(`${__filename} Used existing Redis connection`);

      return client;
    } else {
      client = createClient({ url: REDIS_URI });
      client.on("error", handleErr);
      client.on("connect", handleConnect);
      client.on("reconnecting", handleReconnecting);
      await client.connect();

      logger.debug("New Redis connection is successfully established");
      return client;
    }
  },

  end: function (): void {
    if (client) client.disconnect();
    client = undefined;

    logger.error("Redis connection was forcibly closed");
  },

  quit: function (): void {
    if (client) client.quit();
    client = undefined;

    logger.debug("Redis connection closed cleanly");
  },
};
