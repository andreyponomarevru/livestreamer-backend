import React, { ReactElement } from "react";

import { PlayToggleBtn } from "./play-toggle-btn/play-toggle-btn";

import "./stream-bar-player.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isPlaying: boolean;
}

export function StreamBarPlayer(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <div className={`stream-bar-player ${className}`}>
      <PlayToggleBtn isPlaying={props.isPlaying} handleBtnClick={() => {}} />
      <span className="stream-bar-player__timer">02:05:25</span>
    </div>
  );
}
