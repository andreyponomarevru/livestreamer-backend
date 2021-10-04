import { v4 as uuidv4 } from "uuid";

import * as db from "../../models/broadcast/queries";
import {
  BroadcastUpdate,
  WSClientStoreStats,
  NewBroadcast,
  BroadcastDraft,
  NewBroadcastLike,
  Bookmark,
} from "../../types";
import { getCurrentISOTimestampWithoutTimezone } from "../../utils/utils";
import { NODE_ENV, SAVED_STREAMS_DIR } from "../../config/env";
import broadcastEvents from "./broadcast-events";

export async function createBroadcast() {
  const title = getCurrentISOTimestampWithoutTimezone();
  const writeTo = `${SAVED_STREAMS_DIR}/${uuidv4()}.mp3`;

  return await db.create({
    title,
    downloadUrl: writeTo,
    listenerPeakCount: 0,
    isVisible: false,
  });
}

export async function readBroadcast(broadcastId: number) {
  return await db.read(broadcastId);
}

export async function readAllPublishedBroadcasts() {
  return await db.readAll({ isVisible: true });
}

export async function readAllHiddenBroadcasts() {
  return await db.readAll({ isVisible: false });
}

/* TODO: probably need to be moved somewhere. Implement as follows: on each client count change compare it with count stored in Redis. If it is bigger - update count in Redis. When stream is closed, save count to Postgres
 */
export async function updatePeakClientCount(count: number) {
  // I need broadcast ID to update it, how to get it?
  //db.update(count);
}

export async function updatePublishedBroadcast(broadcast: BroadcastUpdate) {
  return await db.update(broadcast, { isVisible: true });
}

export async function updateHiddenBroadcast(broadcast: BroadcastUpdate) {
  return await db.update(broadcast, { isVisible: false });
}

export async function destroyBroadcast(broadcastId: number) {
  return await db.destroy(broadcastId);
}

export async function likeBroadcast(like: NewBroadcastLike) {
  const broadcastLike = await db.like(like);
  broadcastEvents.like(broadcastLike);
}

export async function bookmarkBroadcast(bookmark: Bookmark) {
  return await db.bookmark(bookmark);
}

export async function readAllBookmarkedBroadcasts(userId: number) {
  return await db.readAllBookmarked(userId);
}

export async function unbookmarkBroadcast(bookmark: Bookmark) {
  return await db.unbookmark(bookmark);
}
