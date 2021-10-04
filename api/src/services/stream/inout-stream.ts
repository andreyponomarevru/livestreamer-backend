import { Duplex, DuplexOptions } from "stream";
import util from "util";

import { BroadcastDraft } from "../../types";
import { logger } from "../../config/logger";

class InOutStream extends Duplex {
  constructor(options?: DuplexOptions) {
    super(options);

    // By default, new streams are set to the 'flowing' mode. But as there is no need to use the stream right after the app's start up, we pause it. This will ease the subsequent management of the stream.
    this.pause();
  }

  startStream(newBroadcast: BroadcastDraft) {
    logger.debug(`${__filename}: [start] ${util.inspect(newBroadcast)}`);
    this.emit("startstream", newBroadcast);
  }

  endStream() {
    this.emit("endstream");
  }

  _read(size: number) {}

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void,
  ) {
    callback();
  }
}

const inoutStream = new InOutStream();
// By default, new streams are set to the 'flowing' mode. But as there is no need to use the stream right after the app's start up, we pause it. This will ease the subsequent management of the stream.
// inoutStream.pause(); // TODO: uncomment, it if this.pause() inside constructore above doesn't work

export default inoutStream;
