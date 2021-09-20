import { WS_SERVER_URL } from "./env";

export const serverOptions = {
  noServer: true,
  path: new URL(WS_SERVER_URL).pathname,
};

export const STATS_MSG_TIME_INTERVAL = 30000;

export const WS_ALLOWED_EVENTS = {
  broadcastStart: "broadcast:start",
  broadcastEnd: "broadcast:end",
  broadcastError: "broadcast:error",
  broadcastUpdateStats: "broadcast:updatestats",
  broadcastLike: "broadcast:like",
  chatRemoveUser: "chat:deleteclient",
  chatAddUser: "chat:addclient",
  chatCreateComment: "chat:createcomment",
  chatDeleteComment: "chat:deletecomment",
  chatLikeComment: "chat:likecomment",
  chatUnlikeComment: "chat:unlikecomment",
};
