import { Readable, Duplex } from "stream";

export function printReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;

  console.log(`${mode} [${new Date().toISOString()}]`);
}
