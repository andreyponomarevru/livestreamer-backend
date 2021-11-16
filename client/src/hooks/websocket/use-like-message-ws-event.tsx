import * as React from "react";

import { useIsMounted } from "./../use-is-mounted";
import { useWebSocketEvents } from "./../use-websocket-events";
import { ChatMsgLike } from "../../types";

function useLikeMessageWSEvent(
  messageId: number,
  setLikes: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  const isMounted = useIsMounted();

  const likeEvent = useWebSocketEvents<ChatMsgLike | null>(
    "chat:liked_message",
    null
  );
  React.useEffect(() => {
    if (likeEvent && messageId === likeEvent.messageId) {
      setLikes(new Set(likeEvent.likedByUserIds));
    }
  }, [isMounted, likeEvent]);
}

export { useLikeMessageWSEvent };
