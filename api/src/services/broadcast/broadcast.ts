import * as db from "../../models/broadcast/queries";
import { BroadcastUpdate, Bookmark, Broadcast } from "../../types";

export async function read(broadcastId: number): Promise<Broadcast | null> {
  return await db.read(broadcastId);
}

export async function readAllPublished(): Promise<Broadcast[]> {
  return await db.readAll({ isVisible: true });
}

export async function readAllHidden(): Promise<Broadcast[]> {
  return await db.readAll({ isVisible: false });
}

export async function updatePublished(broadcast: BroadcastUpdate) {
  return await db.update(broadcast, { isVisible: true });
}

export async function updateHidden(broadcast: BroadcastUpdate) {
  return await db.update(broadcast, { isVisible: false });
}

export async function destroy(broadcastId: number) {
  return await db.destroy(broadcastId);
}

export async function bookmark(bookmark: Bookmark) {
  return await db.bookmark(bookmark);
}

export async function readAllBookmarked(userId: number) {
  return await db.readAllBookmarked(userId);
}

export async function unbookmark(bookmark: Bookmark) {
  return await db.unbookmark(bookmark);
}
