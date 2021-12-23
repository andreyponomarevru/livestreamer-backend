import * as React from "react";

import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { ChatMessageResponse, APIResponse } from "../types";

type Message = {
  sendMessage: (message: string) => void;
  postMessageRes: APIResponse<ChatMessageResponse>;
};

function usePostMessage(): Message {
  function sendMessage(message: string) {
    sendPostMessageReq(`${API_ROOT_URL}/chat/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ message: message }),
    });
  }

  const {
    state: postMessageRes,
    fetchNow: sendPostMessageReq,
    resetState,
  } = useFetch<ChatMessageResponse>();
  React.useEffect(() => {
    if (postMessageRes.response?.body) resetState();
  }, [postMessageRes]);

  return { sendMessage, postMessageRes };
}

export { usePostMessage };
