import { broadcastRepo } from "../../models/broadcast/queries";
import { BroadcastUpdate, Bookmark, Broadcast } from "../../types";

export const broadcastService = {
  read: async function (broadcastId: number): Promise<Broadcast | null> {
    return await broadcastRepo.read(broadcastId);
  },

  readAllPublished: async function (): Promise<Broadcast[]> {
    return await broadcastRepo.readAll({ isVisible: true });
  },

  readAllHidden: async function (): Promise<Broadcast[]> {
    return await broadcastRepo.readAll({ isVisible: false });
  },

  updatePublished: async function (broadcast: BroadcastUpdate) {
    return await broadcastRepo.update(broadcast, { isVisible: true });
  },

  updateHidden: async function (broadcast: BroadcastUpdate) {
    return await broadcastRepo.update(broadcast, { isVisible: false });
  },

  destroy: async function (broadcastId: number) {
    return await broadcastRepo.destroy(broadcastId);
  },

  bookmark: async function (bookmark: Bookmark) {
    return await broadcastRepo.bookmark(bookmark);
  },

  readAllBookmarked: async function (userId: number) {
    return await broadcastRepo.readAllBookmarked(userId);
  },

  unbookmark: async function (bookmark: Bookmark) {
    return await broadcastRepo.unbookmark(bookmark);
  },
};
