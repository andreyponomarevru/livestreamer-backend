import React, { useState } from "react";

import icons from "./../../icons.svg";

import "./play-toggle-btn.scss";
import { usePlayer } from "../../hooks/use-player";
import { API_ROOT_URL } from "../../config/env";
import { API_STREAM_URL } from "../../config/env";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function PlayToggleBtn(props: Props): JSX.Element {
  const { isPlaying, togglePlay } = usePlayer(
    `${API_ROOT_URL}${API_STREAM_URL}`
  );

  return (
    <button
      id="playstream"
      disabled={!props.isStreamOnline}
      className={`play-toggle-btn ${
        props.isStreamOnline ? "" : "play-toggle-btn_disabled"
      }`}
      onClick={togglePlay}
    >
      <svg className="play-toggle-btn__icon">
        <use href={`${icons}#${isPlaying ? "pause" : "play"}`} />
      </svg>
    </button>
  );
}
