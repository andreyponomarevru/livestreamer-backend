import * as React from "react";

import { useIsMounted } from "./use-is-mounted";
import { useWebSocketEvents } from "./use-ws-stream-like";
import { ChatMsgLike, ChatMsg, ChatMsgUnlike } from "../types";
import { useAuthN } from "./use-authn";
import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { useNavigate } from "react-router";
import { ROUTES } from "../config/routes";

// TODO: commit all changes before editing the code !!!

// TODO: refactor in redux-like state

type UseWSMessageLikes = {
  likes: Set<number>;
  toggleLike: (like: NewLike) => void;
};
type NewLike = { userId: number; messageId?: number };
type Message = { id: ChatMsg["id"]; likedByUserIds: ChatMsg["likedByUserId"] };

function useLikeToggle() {}

function useWSMessageLikes(message: Message): UseWSMessageLikes {
  function isLiked() {
    return auth.user && likes.has(auth.user.id);
  }

  function toggleLike(like: NewLike) {
    if (isLiked()) {
      sendUnlikeMsgRequest(`${API_ROOT_URL}/chat/messages/${message.id}/like`, {
        method: "DELETE",
      });
      setLikes((prev) => new Set([...prev].filter((id) => id !== like.userId)));
    } else {
      sendLikeMsgRequest(`${API_ROOT_URL}/chat/messages/${message.id}/like`, {
        method: "POST",
      });
      setLikes(new Set([...likes, like.userId]));
    }
  }

  const auth = useAuthN();
  const isMounted = useIsMounted();
  const [likes, setLikes] = React.useState(new Set(message.likedByUserIds));

  const likeEvent = useWebSocketEvents<ChatMsgLike | null>(
    "chat:liked_message",
    null
  );
  const unlikeEvent = useWebSocketEvents<ChatMsgUnlike | null>(
    "chat:unliked_message",
    null
  );

  const { state: likeMsgResponse, fetchNow: sendLikeMsgRequest } = useFetch();
  React.useEffect(() => {
    if (auth.user && likeMsgResponse.response) {
      toggleLike({ userId: auth.user.id, messageId: message.id });
    }
  }, [likeMsgResponse]);
  React.useEffect(() => {
    if (likeEvent && likeEvent.messageId === message.id) {
      setLikes(new Set(likeEvent.likedByUserIds));
    }
  }, [isMounted, likeEvent]);

  const { state: unlikeMsgResponse, fetchNow: sendUnlikeMsgRequest } =
    useFetch();
  React.useEffect(() => {
    if (auth.user && unlikeMsgResponse.response) {
      toggleLike({ userId: auth.user.id, messageId: message.id });
    }
  }, [unlikeMsgResponse]);
  React.useEffect(() => {
    if (unlikeEvent && unlikeEvent.messageId === message.id) {
      setLikes(new Set(unlikeEvent.likedByUserIds));
    }
  }, [isMounted, unlikeEvent]);

  return { likes, toggleLike };
}

export { useWSMessageLikes };
