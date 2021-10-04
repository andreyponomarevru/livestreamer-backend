import EventEmitter from "events";
import { SavedBroadcastLike } from "../../types";

class BroadcastEmitter extends EventEmitter {
  like(like: SavedBroadcastLike) {
    this.emit("like", like);
  }
}

export default new BroadcastEmitter();
