import * as React from "react";

import "./chat-msg.scss";

import { ChatIconBtn } from "../chat-icon-btn/chat-icon-btn";
import { useAuthN } from "../../../hooks/use-authn";
import { useFetch } from "../../../hooks/use-fetch";
import { ChatMsg, ChatMsgLike } from "../../../types";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { API_ROOT_URL } from "../../../config/env";
import { hasPermission } from "../../../utils/has-permission";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../config/routes";
import { useWebSocketEvents } from "../../../hooks/use-ws-stream-like";
import { useWSMessageLikes } from "../../../hooks/use-ws-message-likes";

function useWSMessageLikeState({
  messageId,
  likedByUserIds,
}: {
  messageId: ChatMsg["id"];
  likedByUserIds: ChatMsg["likedByUserId"];
}) {
  function like(messageId: number) {
    sendLikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
      method: "POST",
    });
    console.log("Handle Like Message");
  }

  function unlike(messageId: number) {
    sendUnlikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
      method: "DELETE",
    });
  }

  const auth = useAuthN();

  const { likes, toggleLike } = useWSMessageLikes({
    id: messageId,
    likedByUserIds: likedByUserIds,
  });

  const { state: likeMsgResponse, fetchNow: sendLikeMsgRequest } = useFetch();
  React.useEffect(() => {
    if (auth.user && likeMsgResponse.response) {
      toggleLike({ userId: auth.user.id });
    }
  }, [likeMsgResponse]);

  const { state: unlikeMsgResponse, fetchNow: sendUnlikeMsgRequest } =
    useFetch();
  React.useEffect(() => {
    if (auth.user && unlikeMsgResponse.response) {
      toggleLike({ userId: auth.user.id });
    }
  }, [unlikeMsgResponse]);

  return { like, unlike, likes };
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
  message: ChatMsg;
}

export function ChatMsg(props: Props): React.ReactElement {
  function toggleLike() {
    if (!auth.user) {
      navigate(ROUTES.signIn);
      return;
    }

    if (likes.has(auth.user.id)) unlike(props.message.id);
    else like(props.message.id);
  }

  const auth = useAuthN();
  const navigate = useNavigate();

  const hasPermissionToDelete =
    hasPermission(
      { resource: "any_chat_message", action: "delete" },
      auth.user
    ) || props.message.userId === auth.user?.id;

  const { like, unlike, likes } = useWSMessageLikeState({
    messageId: props.message.id,
    likedByUserIds: props.message.likedByUserId,
  });

  //

  return (
    <li className={`chat-msg ${props.className || ""}`}>
      <div className="chat-msg__header">
        <span className="chat-msg__meta">
          <span className="chat-msg__username">{props.message.username}</span>
          <span>&#8226;</span>
          <span className="chat-msg__timestamp">
            {new Date(props.message.createdAt).toLocaleTimeString()}
          </span>
        </span>
      </div>

      <div className="chat-msg__body">{props.message.message}</div>

      <div className="chat-msg__buttons">
        {hasPermissionToDelete && (
          <ChatIconBtn
            icon="trash-can"
            handleBtnClick={() =>
              props.handleDeleteMessage({
                messageId: props.message.id,
                userId: props.message.userId,
              })
            }
          />
        )}
        <div className="chat-msg__like-box">
          <span
            className={`chat-msg__like-counter ${
              auth.user && likes.has(auth.user.id)
                ? "chat-msg__like-counter_liked"
                : ""
            }`}
          >
            {likes.size > 0 ? likes.size : null}
          </span>

          <ChatIconBtn
            isActive={!!auth.user && likes.has(auth.user.id)}
            icon="like"
            handleBtnClick={toggleLike}
          />
        </div>
      </div>
    </li>
  );
}
