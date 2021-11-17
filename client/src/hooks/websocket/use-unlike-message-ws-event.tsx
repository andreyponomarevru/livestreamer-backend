import * as React from "react";

import { useIsMounted } from "../../hooks/use-is-mounted";
import { useWebSocketEvents } from "../../hooks/use-websocket-events";
import { ChatMsgUnlike } from "../../types";

function useUnlikeMessageWSEvent(
  messageId: number,
  setLikes: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  const isMounted = useIsMounted();

  const unlikeEvent = useWebSocketEvents<ChatMsgUnlike | null>(
    "chat:unliked_message",
    null
  );
  React.useEffect(() => {
    if (unlikeEvent && unlikeEvent.messageId === messageId) {
      setLikes(new Set(unlikeEvent.likedByUserIds));
    }
  }, [isMounted, unlikeEvent]);

  return unlikeEvent;
}

export { useUnlikeMessageWSEvent };
