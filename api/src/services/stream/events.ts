import EventEmitter from "events";
import { BroadcastDraft, SavedBroadcastLike } from "../../types";

export class StreamEmitter extends EventEmitter {
  start(broadcast: BroadcastDraft): void {
    this.emit("start", broadcast);
  }

  end(): void {
    this.emit("end");
  }

  like(like: SavedBroadcastLike & { likedByUserUUID: string }): void {
    this.emit("like", like);
  }

  newListenersPeak(listenersNow: number): void {
    this.emit("listeners_peak", listenersNow);
  }
}
