import EventEmitter from "stream";
import util from "util";

import { Broadcast } from "../../types";
import { logger } from "../../config/logger";

class StreamEmitter extends EventEmitter {
  start(newBroadcast: Broadcast) {
    logger.debug(`${__filename}: [start] ${util.inspect(newBroadcast)}`);
    this.emit("start", newBroadcast);
  }

  end() {
    logger.debug(`${__filename}: [end]`);
    this.emit("end");
  }
}

export default new StreamEmitter();
