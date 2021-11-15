import * as React from "react";

import "./chat-controls.scss";
import icons from "./../../../icons.svg";

import { useAuthN } from "../../../hooks/use-authn";
import { useNavigate } from "react-router-dom";
import { HeartBtn } from "../heart-btn/heart-btn";
import { BroadcastState, ChatMsg, ChatMessageResponse } from "../../../types";
import { API_ROOT_URL } from "../../../config/env";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { ROUTES } from "../../../config/routes";
import { useWebSocketEvents } from "../../../hooks/use-ws-stream-like";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleAddChatMessage: (chatMessage: ChatMsg) => void;
}

export function ChatControls(props: Props): React.ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgInput(e.target.value);
  }

  function checkAuth() {
    if (!user) navigate(ROUTES.signIn);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("[handleSubmit] ", message);

    checkAuth();
    const trimmedMsg = message.trim();

    if (trimmedMsg.length > 0 && trimmedMsg.length < 500) {
      console.log("Sending the message to API: ", trimmedMsg);

      sendChatMessageRequest(`${API_ROOT_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ message: trimmedMsg }),
      });
    }
  }

  const streamStateEvent = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });
  const [message, setMsgInput] = React.useState("");
  const isMounted = useIsMounted();
  const { state: chatMessageResponse, fetchNow: sendChatMessageRequest } =
    useFetch<ChatMessageResponse>();
  React.useEffect(() => {
    if (isMounted && chatMessageResponse.response?.body) {
      props.handleAddChatMessage(chatMessageResponse.response.body.results);
      setMsgInput("");
    }
  }, [isMounted, chatMessageResponse]);

  const { user } = useAuthN();
  const navigate = useNavigate();

  return (
    <form className="chat-controls chat-page__controls" onSubmit={handleSubmit}>
      <label htmlFor="chat-message" />
      <input
        id="chat-message"
        className="chat-controls__input"
        type="text"
        maxLength={500}
        minLength={1}
        name="chat-message"
        autoComplete="off"
        placeholder="Type a message here..."
        value={message}
        onChange={handleChange}
        onClick={checkAuth}
      />
      <div className="chat-controls__btns">
        <button
          className={`send-chat-msg-btn ${props.className || ""}`}
          type="submit"
          name="chat-message"
          value=""
        >
          <svg className="send-chat-msg-btn__icon">
            <use href={`${icons}#arrow-right`} />
          </svg>
        </button>
        <HeartBtn isStreamOnline={streamStateEvent.isOnline} />
      </div>
    </form>
  );
}
