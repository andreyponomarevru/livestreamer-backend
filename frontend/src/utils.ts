import fs from "fs-extra";
import { Readable } from "stream";

// Write readable to disk i.e. push data into writable stream to save audio
export function writeStream(readable: Readable, saveTo: string): void {
  const writableStream = fs.createWriteStream(saveTo);
  readable.pipe(writableStream);
}
