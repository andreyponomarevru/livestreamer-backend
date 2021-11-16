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
  handleAddMessage: (message: ChatMsg) => void;
}

function usePostMessage() {
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

export function ChatControls(props: Props): React.ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgInput(e.target.value);
  }

  function checkAuth() {
    if (!user) navigate(ROUTES.signIn);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    checkAuth();

    const trimmedMsg = msgInput.trim();
    if (trimmedMsg.length > 0 && trimmedMsg.length < 500) {
      sendMessage(trimmedMsg);
    }
  }

  const [msgInput, setMsgInput] = React.useState("");
  const { sendMessage, postMessageRes } = usePostMessage();
  React.useEffect(() => {
    if (postMessageRes.response?.body) {
      props.handleAddMessage(postMessageRes.response.body.results);
      setMsgInput("");
    }
  }, [postMessageRes]);

  const streamStateEvent = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });

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
        value={msgInput}
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
