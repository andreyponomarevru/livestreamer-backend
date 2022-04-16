import * as React from "react";

import { useWebSocketEvents } from "./../use-websocket-events";
import { ChatMsgId } from "../../types";

function useDeleteMessageWSEvent(deleteMessage: (id: number) => void) {
  const deleteMsgEvent = useWebSocketEvents<ChatMsgId | null>(
    "chat:deleted_message",
    null
  );
  React.useEffect(() => {
    if (deleteMsgEvent) deleteMessage(deleteMsgEvent.id);
  }, [deleteMsgEvent]);
}

export { useDeleteMessageWSEvent };
