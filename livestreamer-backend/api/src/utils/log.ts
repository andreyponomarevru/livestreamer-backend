import { Readable, Duplex } from "stream";

export function showReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;

  console.log(`${mode} [${new Date().toISOString()}]`);
}
