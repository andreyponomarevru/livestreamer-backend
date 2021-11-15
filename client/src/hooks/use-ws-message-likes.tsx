import * as React from "react";

import { useIsMounted } from "./use-is-mounted";
import { useWebSocketEvents } from "./use-ws-stream-like";
import { ChatMsgLike, ChatMsg, ChatMsgUnlike } from "../types";
import { useAuthN } from "./use-authn";

type UseWSMessageLikes = {
  likes: Set<number>;
  toggleLike: (like: NewLike) => void;
};
type NewLike = { userId: number; messageId?: number };
type Message = { id: ChatMsg["id"]; likedByUserIds: ChatMsg["likedByUserId"] };

function useWSMessageLikes(message: Message): UseWSMessageLikes {
  function isLiked() {
    return auth.user && likes.has(auth.user.id);
  }

  function toggleLike(like: NewLike) {
    if (isLiked()) {
      setLikes((prev) => new Set([...prev].filter((id) => id !== like.userId)));
    } else {
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

  React.useEffect(() => {
    if (likeEvent && likeEvent.messageId === message.id) {
      setLikes(new Set(likeEvent.likedByUserIds));
    }
  }, [isMounted, likeEvent]);
  React.useEffect(() => {
    if (unlikeEvent && unlikeEvent.messageId === message.id) {
      setLikes(new Set(unlikeEvent.likedByUserIds));
    }
  }, [isMounted, unlikeEvent]);

  return { likes, toggleLike };
}

export { useWSMessageLikes };
