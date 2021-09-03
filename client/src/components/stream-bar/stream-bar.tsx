import React, { ReactElement, useState } from "react";

import { StreamBarCounters } from "./../stream-bar-counters/stream-bar-counters";
import { StreamBarStatus } from "./../stream-bar-status/stream-bar-status";
import { StreamBarPlayer } from "./../stream-bar-player/stream-bar-player";

import "./stream-bar.scss";

//

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function StreamBar(props: Props): ReactElement {
  const { className = "" } = props;

  const isPlaying = true;

  if (isPlaying) {
    return (
      <div className={`stream-bar ${className}`}>
        <StreamBarPlayer className="stream-bar__player" isPlaying={isPlaying} />
        <StreamBarStatus className="stream-bar__status" isPlaying={isPlaying} />
        <StreamBarCounters
          className="stream-bar__counters"
          listenersCount={0}
          heartsCount={0}
        />
      </div>
    );
  } else {
    return (
      <div className={`stream-bar ${className}`}>
        <div></div>
        <StreamBarStatus isPlaying={isPlaying} />
        <div></div>
      </div>
    );
  }
}
