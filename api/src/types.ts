import WebSocket from "ws";

//
// Web Socket
//

export interface WSClient extends AuthNtedClient {
  socket: WebSocket;
}
export type SanitizedWSClient = {
  id: number;
  username: string;
};

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
  peakListenerCount: number;
  broadcastLikeCount: number;
};
export interface WSMsgPayload {
  broadcastLike: { commentId: number };
  chatRemoveUser: { username: string };
  chatAddUser: { username: string };
  chatCreateCommentPayload: { message: string };
  chatDeleteCommentPayload: { commentId: number };
  chatLikeCommentPayload: { commentId: number };
  chatUnlikeCommentPayload: { commentId: number };
  chatConnectedClientsPayload: { userId: number };
}
export type WSEvents =
  | "broadcast:updatestats"
  | "chat:deleteclient"
  | "broadcast:like"
  | "chat:addclient"
  | "chat:createcomment"
  | "chat:deletecomment"
  | "chat:likecomment"
  | "chat:unlikecomment"
  | "chat:connectedclients"
  | "stream:online"
  | "stream:offline";

//
// API
//

export type SignUpCredentials = {
  email: string;
  username: string;
  password: string;
};

export type SignUpConfirmation = {
  userId: number;
  token: string;
};

export interface UnconfirmedUserProfile {
  id: number;
}

export type AuthNtedClient = { id: number; username: string };

export type PermissionNames =
  | "userProfiles"
  | "userProfile"
  | "userSettings"
  | "userBookmarks"
  | "broadcasts"
  | "broadcast"
  | "broadcastTracklist"
  | "streamLike"
  | "stream"
  | "chatComments"
  | "chatComment"
  | "chatCommentLike";
export type Permissions = {
  [key in PermissionNames]: string[];
};

export interface Account {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  isConfirmed: boolean;
  isDeleted: boolean;
  permissions: Permissions;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  permissions: Permissions;
}

export interface Schedule {
  id?: number;
  title: string;
  startAt: string;
  endAt: string;
}

export interface Broadcast {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  listenerPeakCount: string;
  downloadUrl?: string;
  listenUrl?: string;
  isVisible: boolean;
  likesCount: number;
}

export interface ChatCommentConstructor {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
  message: string;
}

// Requests

export type ChatCommentGETPaginatedReq = {
  page: number;
};
export interface ChatCommentPOSTReq {
  userId: number;
  message: string;
}
export interface ChatCommentDELETEReq {
  commentId: number;
}
export type ChatCommentLikePOSTReq = {
  commentId: number;
  likedByUserId: number;
};
