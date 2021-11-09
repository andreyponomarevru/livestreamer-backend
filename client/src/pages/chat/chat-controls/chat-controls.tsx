import React, { useState, useContext, ReactElement, useEffect } from "react";

import { useAuthN } from "../../../hooks/use-authn";
import { useNavigate } from "react-router-dom";
import { HeartBtn } from "../heart-btn/heart-btn";
import { BroadcastState, ChatMsg, ChatMessageResponse } from "../../../types";
import { API_ROOT_URL } from "../../../config/env";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";

import "./chat-controls.scss";
import icons from "./../../../icons.svg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  broadcastState: BroadcastState;
  handleAddChatComment: (chatComment: ChatMsg) => void;
}

export function ChatControls(props: Props): ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgInput(e.target.value);
  }

  function checkAuth() {
    if (!user) navigate("/signin");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("[handleSubmit] ", msgInput);

    checkAuth();
    const trimmedMsg = msgInput.trim();

    if (trimmedMsg.length > 0 && trimmedMsg.length < 500) {
      console.log("Sending the message to API: ", trimmedMsg);

      sendChatMessage(`${API_ROOT_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ message: trimmedMsg }),
      });
    }
  }

  const [msgInput, setMsgInput] = useState("");

  const isMounted = useIsMounted();
  const [chatMessage, sendChatMessage] = useFetch<ChatMessageResponse>();
  useEffect(() => {
    if (isMounted && chatMessage.response?.body) {
      setMsgInput("");
      props.handleAddChatComment(chatMessage.response.body.results);
    }
  }, [isMounted, chatMessage]);

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
        <HeartBtn isStreamOnline={props.broadcastState.isOnline} />
      </div>
    </form>
  );
}
