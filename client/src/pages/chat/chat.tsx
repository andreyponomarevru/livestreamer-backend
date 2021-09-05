import React, { Fragment, ReactElement } from "react";

import { ChatControls } from "./../../components/chat-controls/chat-controls";
import { ChatComment } from "../../components/chat-comment/chat-comment";

import "./chat.scss";

export function PagesChat(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <main className="chat-page">
      <div className="chat-page__log">
        {...arr.map((_, index) => {
          return (
            <ChatComment
              key={index}
              username="anon2537"
              timestamp="23:07:51"
              body="Hi Admin, well I have a question regarding pancakeswap my trust wallet
        keys: october strike nerve immune mass"
              handleBtnClick={() => {}}
            />
          );
        })}
      </div>

      <ChatControls handleBtnClick={() => {}} className="chat-page__controls" />
    </main>
  );
}
