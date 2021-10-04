import WebSocket from "ws";

//
// Web Socket
//

export type WSClientStoreStats = {
  clientCount: number;
  clientPeakCount: number;
};
export interface WSClient {
  id: number;
  username: string;
  socket: WebSocket;
}
export interface ExposedWSClient {
  id: number;
  username: string;
}
export type WSSysMsg<Data> = {
  event: WSEvents;
  data?: Data;
};
export type WSUserMsg<Data> = {
  event: WSEvents;
  clientUUID: string;
  username: string;
  data?: Data;
};
export type BroadcastUpdateStatsPayload = {
  currentListenerCount: number;
  listenerPeakCount: number;
  broadcastLikeCount: number;
};
export interface WSMsgPayload {
  broadcastLike: { msgId: number };
  chatRemoveUser: { username: string };
  chatAddUser: { username: string };
  chatCreateMsgPayload: { msg: string };
  chatDeleteMsgPayload: { msgId: number };
  chatLikeMsgPayload: { msgId: number };
  chatUnlikeMsgPayload: { msgId: number };
  chatConnectedClientsPayload: { userId: number };
}
export type WSEvents =
  | "broadcast:updatestats"
  | "chat:updatestats"
  | "chat:deleteclient"
  | "broadcast:like"
  | "chat:addclient"
  | "chat:createmessage"
  | "chat:deletemessage"
  | "chat:likemessage"
  | "chat:unlikemessage"
  | "chat:connectedclients"
  | "stream:online"
  | "stream:offline";

//
// API
//

export type CursorPagination = {
  nextCursor?: string;
  limit: number;
};

export type SavedBroadcastLike = {
  broadcastId: number;
  likedByUserId: number;
  likesCount: number;
};
export type NewBroadcastLike = {
  broadcastId: number;
  userId: number;
};
export type Bookmark = {
  userId: number;
  broadcastId: number;
};

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  isConfirmed: boolean;
  isDeleted: boolean;
  permissions: Permissions;
}
export interface SanitizedUser {
  id: number;
  email: string;
  username: string;
  permissions: { [key: string]: string[] };
}

export interface Schedule {
  id?: number;
  title: string;
  startAt: string;
  endAt: string;
}

export interface BroadcastDraft {
  id: number;
  title: string;
  startAt: string;
  listenerPeakCount: number;
}
export interface NewBroadcast {
  title: string;
  listenerPeakCount: number;
  downloadUrl?: string;
  isVisible?: boolean;
}
export interface Broadcast {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  listenerPeakCount: number;
  downloadUrl: string;
  listenUrl: string;
  likesCount: number;
  isVisible: boolean;
  tracklist: string;
}
export interface BroadcastUpdate {
  id: number;
  title?: string;
  tracklist?: string;
  downloadUrl?: string;
  listenUrl?: string;
  listenerPeakCount?: number;
  isVisible?: boolean;
  endAt?: Date | string;
}
export interface BroadcastDBResponse {
  broadcast_id: number;
  title: string;
  tracklist: string;
  start_at: string;
  end_at: string;
  listener_peak_count: number;
  download_url: string;
  listen_url: string;
  is_visible: boolean;
  likes_count: number;
}

export interface ChatMsg {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
  message: string;
  likedByUserId: number[];
}
export type ChatMsgId = {
  id: number;
  userId: number;
};
export type NewChatMsg = {
  userId: number;
  message: string;
};
export type ChatMsgLike = {
  messageId: number;
  likedByUserId: number;
  likedByUserIds: number[];
};
export type ChatMsgUnlike = {
  messageId: number;
  unlikedByUserId: number;
  likedByUserIds: number[];
};
export type PaginatedChatMsgs = {
  nextCursor: string | null;
  messages: ChatMsg[];
};
