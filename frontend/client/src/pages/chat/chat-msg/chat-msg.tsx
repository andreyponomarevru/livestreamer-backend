import * as React from "react";

import "./chat-msg.scss";

import { ChatIconBtn } from "../chat-icon-btn/chat-icon-btn";
import { useAuthN } from "../../../hooks/use-authn";
import { ChatMsg } from "../../../types";
import { hasPermission } from "../../../utils/has-permission";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../config/routes";
import { useMessageLikeToggle } from "../../../hooks/use-message-like-toggle";
import { useLikeMessageWSEvent } from "../../../hooks/websocket/use-like-message-ws-event";
import { useUnlikeMessageWSEvent } from "../../../hooks/websocket/use-unlike-message-ws-event";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
  message: ChatMsg;
}

function ChatMsg(props: Props): React.ReactElement {
  const auth = useAuthN();
  const navigate = useNavigate();

  const hasPermissionToDelete =
    hasPermission(
      { resource: "any_chat_message", action: "delete" },
      auth.user
    ) || props.message.userId === auth.user?.id;

  const { likes, toggleLike, setLikes, isLiked } = useMessageLikeToggle(
    props.message.likedByUserId
  );

  useLikeMessageWSEvent(props.message.id, setLikes);
  useUnlikeMessageWSEvent(props.message.id, setLikes);

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
            isActive={isLiked(likes)}
            icon="like"
            handleBtnClick={() => {
              if (!auth.user) navigate(ROUTES.signIn);
              else toggleLike(props.message.id);
            }}
          />
        </div>
      </div>
    </li>
  );
}

export { ChatMsg };
