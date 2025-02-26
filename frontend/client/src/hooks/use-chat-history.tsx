import * as React from "react";
import { useFetch } from "./use-fetch";
import { useIsMounted } from "./use-is-mounted";
import { ChatMsgsPageResponse, ChatMsg } from "../types";
import { API_ROOT_URL } from "../config/env";

function useChatHistory() {
  function addMessage(message: ChatMsg) {
    setMessages((m) => [...m, message]);
  }

  function deleteMessage(id: number) {
    setMessages((m) => m.filter((m) => m.id !== id));
  }

  const isMounted = useIsMounted();
  // TODO: implement pagination using 'nextCursor'
  const [nextCursor, setNextCursor] = React.useState();
  const { state: getMessagesRes, fetchNow: gethMessagesReq } =
    useFetch<ChatMsgsPageResponse>();

  React.useEffect(() => {
    if (isMounted) {
      gethMessagesReq(
        `${API_ROOT_URL}/chat/messages?limit=50${
          nextCursor ? `&next_cursor=${nextCursor}` : ""
        }`,
        {
          method: "get",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
        }
      );
    }
  }, [isMounted, nextCursor]);

  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  React.useEffect(() => {
    if (getMessagesRes.response?.body) {
      setMessages(getMessagesRes.response.body.results.messages);
    }
  }, [getMessagesRes]);

  return { messages, addMessage, deleteMessage };
}

export { useChatHistory };
