import { HTTP_PORT } from "../config/env";
import { logger } from "../config/logger";

function onServerListening(): void {
  logger.debug(
    `${__filename}: API HTTP Server is listening on port ${HTTP_PORT}`,
  );
}

export { onServerListening };
