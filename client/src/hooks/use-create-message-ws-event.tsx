import * as React from "react";

import { useWebSocketEvents } from "./use-websocket-events";
import { ChatMsg } from "../types";

function useCreateMessageWSEvent(addMessage: (message: ChatMsg) => void) {
  const newChatMessage = useWebSocketEvents<ChatMsg | null>(
    "chat:created_message",
    null
  );
  React.useEffect(() => {
    if (newChatMessage) addMessage(newChatMessage);
  }, [newChatMessage]);
}

export { useCreateMessageWSEvent };
