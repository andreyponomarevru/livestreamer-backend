import EventEmitter from "events";
import { BroadcastDraft, SavedBroadcastLike } from "../../types";

export interface StreanEmitter {
  on(event: "start", listener: (broadcast: BroadcastDraft) => void): this;
  on(event: "end", listener: () => void): this;
  on(
    event: "like",
    listener: (like: SavedBroadcastLike & { likedByUserUUID: string }) => void,
  ): this;
  on(event: "listeners_peak", listener: (listenersNow: number) => void): this;
}

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
