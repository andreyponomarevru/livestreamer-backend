import React, { ReactElement } from "react";

import "./stream-bar-status.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isPlaying: boolean;
}

export function StreamBarStatus(props: Props): ReactElement {
  const { className = "" } = props;

  const stateClassName = props.isPlaying
    ? "stream-bar-status_online"
    : "stream-bar-status_offline";

  return (
    <div className={`stream-bar-status ${className} ${stateClassName}`}>
      <div className="stream-bar-status__live-dot"></div>
      <div>{props.isPlaying ? "LIVE NOW" : "OFFLINE"}</div>
    </div>
  );
}
