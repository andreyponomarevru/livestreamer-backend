import * as React from "react";

import { useIsMounted } from "./use-is-mounted";
import { useWebSocketEvents } from "./use-ws-stream-like";
import { ChatMsgLike, ChatMsg, ChatMsgUnlike } from "../types";

type UseWSMessageLikes = {
  likes: Set<number>;
  addLike: (likedByUserId: number) => void;
  removeLike: (unlikedByUserId: number) => void;
};

function useWSMessageLikes({
  messageId,
  likedByUserIds,
}: {
  messageId: ChatMsg["id"];
  likedByUserIds: ChatMsg["likedByUserId"];
}): UseWSMessageLikes {
  function addLike(likedByUserId: number) {
    setMessageLikes((prev) => {
      return new Set([...likes, likedByUserId]);
    });
  }

  function removeLike(unlikedByUserId: number) {
    setMessageLikes((prev) => {
      return new Set([...prev].filter((id) => id !== unlikedByUserId));
    });
  }

  const isMounted = useIsMounted();
  const [likes, setMessageLikes] = React.useState(new Set(likedByUserIds));

  const msgLikeEvent = useWebSocketEvents<ChatMsgLike | null>(
    "chat:liked_message",
    null
  );
  React.useEffect(() => {
    if (msgLikeEvent && msgLikeEvent.messageId === messageId) {
      setMessageLikes(new Set(msgLikeEvent.likedByUserIds));
    }
  }, [isMounted, msgLikeEvent]);

  const msgUnlikeEvent = useWebSocketEvents<ChatMsgUnlike | null>(
    "chat:unliked_message",
    null
  );
  React.useEffect(() => {
    if (msgUnlikeEvent && msgUnlikeEvent.messageId === messageId) {
      setMessageLikes(new Set(msgUnlikeEvent.likedByUserIds));
    }
  }, [isMounted, msgUnlikeEvent]);

  return { likes, addLike, removeLike };
}

export { useWSMessageLikes };
