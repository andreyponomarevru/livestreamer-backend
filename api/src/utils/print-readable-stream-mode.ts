import { Readable, Duplex } from "stream";
import { logger } from "../config/logger";

export function printReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;

  logger.debug(`${mode} [${new Date().toISOString()}]`);
}
