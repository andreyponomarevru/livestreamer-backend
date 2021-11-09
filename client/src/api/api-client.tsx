import { API_ROOT_URL } from "../config/env";

// Schedule

export function useScheduleBroadcast({
  title,
  startAt,
  endAt,
}: {
  title: string;
  startAt: string;
  endAt: string;
}) {
  const URL = `${API_ROOT_URL}/schedule`; // POST
}
export function useDestroyScheduledBroadcast(id: number) {
  const URL = `${API_ROOT_URL}/schedule/${id}`; // DELETE
}

// Broadcast

export function useUpdateBroadcast(id: number) {
  const URL = `${API_ROOT_URL}/broadcasts/${id}`; // PATCH
}
export function useDestroyBroadcast(id: number) {
  const URL = `${API_ROOT_URL}/broadcasts/${id}`; // DELETE
}
export function useBookmarkBroadcast(broadcstId: number) {
  const URL = `${API_ROOT_URL}/broadcasts/${broadcstId}/bookmark`; // POST
}
export function useRemoveBroadcastFromBookmarks(broadcastId: number) {
  const URL = `${API_ROOT_URL}/broadcasts/${broadcastId}/bookmark`; // DELETE
}
export function useGetAllBroadcastDrafts() {
  const URL = `${API_ROOT_URL}/broadcasts/drafts`; // GET
}
export function useUpdateBroadcastDraft(id: number) {
  const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // PATCH
}
export function useDestroyBroadcastDraft(id: number) {
  const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // DELETE
}

// Admin
export function useDestroyAnyChatMsg(id: number) {
  const URL = `${API_ROOT_URL}/admin/chat/messages/${id}`; // DELETE
}

// Chat
export function destroyChatMessage(id: number) {
  const URL = `${API_ROOT_URL}/chat/messages/${id}`; // DELETE
}
export function likeChatMessage(id: number) {
  const URL = `${API_ROOT_URL}/chat/messages/${id}/like`; // POST
}
export function unlikeChatMessage(id: number) {
  const URL = `${API_ROOT_URL}/chat/messages/${id}/like`; // DELETE
}

// Stream
export function useGetStream() {
  const URL = `${API_ROOT_URL}/stream`; // GET
}
