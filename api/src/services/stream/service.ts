import fs from "fs";
import { InOutStream } from "./inout-stream";
import { BroadcastDraft, BroadcastState } from "../../types";
import { broadcastRepo } from "../../models/broadcast/queries";
import { streamRepo } from "../../models/stream/queries";
import { StreamEmitter } from "./events";

export const streamService = {
  events: new StreamEmitter(),

  readBroadcastState: async function (): Promise<BroadcastState> {
    if (inoutStream.isPaused()) {
      return { isOnline: false };
    } else {
      const liveBroadcast = await this.readLiveBroadcast();
      const liveBroadcastLikes = await this.readLikesCount();
      const broadcast = { ...liveBroadcast, ...liveBroadcastLikes };
      return { isOnline: true, broadcast };
    }
  },

  startBroadcast: async function ({
    listenersNow,
  }: {
    listenersNow: number;
  }): Promise<void> {
    const newBroadcast = await broadcastRepo.create({
      title: this.buildStreamTitle(),
      listenerPeakCount: listenersNow,
      startAt: new Date().toISOString(),
      isVisible: false,
    });

    await streamRepo.create(newBroadcast);
    this.events.start(newBroadcast);
  },

  endBroadcast: async function (): Promise<void> {
    this.events.end();
    const listenerPeakCount = await streamRepo.readListenerPeakCount();
    const id = await streamRepo.readBroadcastId();
    await broadcastRepo.update(
      { id, listenerPeakCount, endAt: new Date().toISOString() },
      { isVisible: false },
    );
    await streamRepo.destroy();
  },

  updateListenerPeakCount: async function (
    listenersNow: number,
  ): Promise<void> {
    if (listenersNow > (await streamRepo.readListenerPeakCount())) {
      await streamRepo.updateListenerPeakCount(listenersNow);
      this.events.newListenersPeak(listenersNow);
    }
  },

  readLiveBroadcast: async function (): Promise<BroadcastDraft> {
    return await streamRepo.read();
  },

  like: async function ({
    userUUID,
    userId,
  }: {
    userUUID: string;
    userId: number;
  }): Promise<void> {
    const broadcastId = await streamRepo.readBroadcastId();
    const like = await streamRepo.createLike(userId, broadcastId);

    this.events.like({
      likedByUserId: userId,
      likedByUserUUID: userUUID,
      likedByUsername: like.likedByUsername,
      likeCount: like.likeCount,
      broadcastId,
    });
  },

  readLikesCount: async function (): Promise<{ likeCount: number }> {
    return await broadcastRepo.readLikesCount(
      await streamRepo.readBroadcastId(),
    );
  },

  buildStreamTitle: function (): string {
    return new Date(new Date().toUTCString()).toDateString();
  },
};

export const inoutStream = new InOutStream();
// By default, new readable streams are set to the 'paused' mode. But when we add 'data' event handler or use `pipe`, we auto set readable stream into 'flowing' mode. So, when there are no listeners (hence no 'pipe' method is attached to stream), the stream will switch back to pause mode (although broadcaster may still continue to stream). We don't want that to happen, so to set the stream to flowing mode from the ground up, we pipe it to nowhere. It doesn't matter where to pipe, as long as the 'pipe' method is used, because as I've already mentioned, we use 'pipe' only to set the stream into 'flowing' mode and don't care where it will send data
inoutStream.pipe(fs.createWriteStream("\\\\.\\NUL"));
// Pause the stream on app startup because initially there is no broadcaster, so there is nothing to stream. Without pausing, clients trying to connect won't recieve 404, the request will just hang without response
inoutStream.pause();
