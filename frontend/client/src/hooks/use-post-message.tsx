import * as React from "react";

import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { ChatMessageResponse, APIResponse } from "../types";
import { useNavigate } from "react-router";
import { ROUTES } from "../config/routes";
import { useAuthN } from "./use-authn";

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

  const navigate = useNavigate();
  const auth = useAuthN();
  const {
    state: postMessageRes,
    fetchNow: sendPostMessageReq,
    resetState,
  } = useFetch<ChatMessageResponse>();
  React.useEffect(() => {
    if (postMessageRes.response?.body) {
      resetState();
    } else if (postMessageRes.error?.status === 401) {
      auth.setUser(null);
      navigate(ROUTES.signIn);
    }
  }, [postMessageRes]);

  return { sendMessage, postMessageRes };
}

export { usePostMessage };
