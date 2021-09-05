import React, { ReactElement } from "react";

import "./stream-bar-status.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isPlaying: boolean;
}

export function StreamBarStatus(props: Props): ReactElement {
  const textClassName = props.isPlaying
    ? "stream-bar-status__text_online"
    : "stream-bar-status__text_offline";

  const dotClassName = props.isPlaying
    ? "stream-bar-status__dot_online"
    : "stream-bar-status__dot_offline";

  return (
    <div className="stream-bar-status">
      <div className={`stream-bar-status__dot ${dotClassName}`}></div>
      <div className={textClassName}>
        {props.isPlaying ? "LIVE NOW" : "OFFLINE"}
      </div>
    </div>
  );
}
