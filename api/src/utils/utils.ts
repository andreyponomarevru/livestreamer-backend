import { Readable, Duplex } from "stream";

function showReadableStreamMode(
  stream: Readable | Duplex,
  streamName: string,
): void {
  const mode = stream.isPaused()
    ? `${streamName} PAUSED`
    : `${streamName} FLOWING`;
  console.log(mode);
}

export { showReadableStreamMode };
