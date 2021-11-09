import React, { ReactElement, useContext } from "react";

import { LikeBtn } from "../like-btn/like-btn";

import "./chat-msg.scss";
import { DeleteBtn } from "../delete-btn/delete-btn";
import { useAuthN } from "../../../hooks/use-authn";
import { ProtectedComponent } from "../../../lib/protected-component/protected-component";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  username: string;
  timestamp: string;
  body: string;
  likedByUserId: number[];
}

export function ChatMsg(props: Props): ReactElement {
  const { className = "" } = props;

  const { user } = useAuthN();

  return (
    <li className={`chat-msg ${className}`}>
      <div className="chat-msg__header">
        <span className="chat-msg__meta">
          <span className="chat-msg__username">{props.username}</span>
          <span>&#8226;</span>
          <span className="chat-msg__timestamp">{props.timestamp}</span>
        </span>
      </div>

      <div className="chat-msg__body">
        {props.body}
        <ProtectedComponent resource="any_chat_message" action="delete">
          <button className="chat-msg__delete-btn">Delete</button>
        </ProtectedComponent>
      </div>

      <div className="chat-msg__like-box">
        <span className="chat-msg__like-counter">
          {user && props.likedByUserId.length}
        </span>
        {user && <LikeBtn handleBtnClick={() => {}} />}
      </div>
    </li>
  );
}
