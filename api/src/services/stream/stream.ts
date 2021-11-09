import { InOutStream } from "./inout-stream";
import { BroadcastDraft, BroadcastState } from "../../types";
import * as broadcastDB from "../../models/broadcast/queries";
import * as streamCacheDB from "../../models/stream/queries";
import { StreamEmitter } from "./events";

async function readBroadcastState(): Promise<BroadcastState> {
  if (inoutStream.isPaused()) {
    return { isOnline: false };
  } else {
    const liveBroadcast = await readLiveBroadcast();
    const liveBroadcastLikes = await readLikesCount();
    const broadcast = { ...liveBroadcast, ...liveBroadcastLikes };
    return { isOnline: true, broadcast };
  }
}

async function startBroadcast({
  listenersNow,
}: {
  listenersNow: number;
}): Promise<void> {
  const newBroadcast = await broadcastDB.create({
    title: buildStreamTitle(),
    listenerPeakCount: listenersNow,
    startAt: new Date().toISOString(),
    isVisible: false,
  });

  await streamCacheDB.create(newBroadcast);
  events.start(newBroadcast);
}

async function endBroadcast(): Promise<void> {
  events.end();
  const listenerPeakCount = await streamCacheDB.readListenerPeakCount();
  const id = await streamCacheDB.readBroadcastId();
  await broadcastDB.update(
    { id, listenerPeakCount, endAt: new Date().toISOString() },
    { isVisible: false },
  );
  await streamCacheDB.destroy();
}

async function updateListenerPeakCount(listenersNow: number): Promise<void> {
  if (listenersNow > (await streamCacheDB.readListenerPeakCount())) {
    await streamCacheDB.updateListenerPeakCount(listenersNow);
    events.newListenersPeak(listenersNow);
  }
}

async function readLiveBroadcast(): Promise<BroadcastDraft> {
  return await streamCacheDB.read();
}

async function like({
  userUUID,
  userId,
}: {
  userUUID: string;
  userId: number;
}): Promise<void> {
  const broadcastId = await streamCacheDB.readBroadcastId();
  const like = await streamCacheDB.createLike(userId, broadcastId);

  events.like({
    likedByUserId: userId,
    likedByUserUUID: userUUID,
    likedByUsername: like.likedByUsername,
    likeCount: like.likeCount,
    broadcastId,
  });
}

async function readLikesCount(): Promise<{ likeCount: number }> {
  return await broadcastDB.readLikesCount(
    await streamCacheDB.readBroadcastId(),
  );
}

function buildStreamTitle(): string {
  return new Date(new Date().toUTCString()).toDateString();
}

const events = new StreamEmitter();
const inoutStream = new InOutStream();

export {
  inoutStream,
  events,
  like,
  updateListenerPeakCount,
  startBroadcast,
  endBroadcast,
  readBroadcastState,
};
