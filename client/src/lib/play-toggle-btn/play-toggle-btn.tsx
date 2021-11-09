import React, { useState } from "react";

import icons from "./../../icons.svg";

import "./play-toggle-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isDisabled: boolean;
}

export function PlayToggleBtn(props: Props): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    setIsPlaying((prev) => !prev);

    props.handleBtnClick();
  }

  return (
    <button
      disabled={props.isDisabled}
      className={`play-toggle-btn ${
        props.isDisabled ? "play-toggle-btn_disabled" : ""
      }`}
      onClick={handleClick}
    >
      <svg className="play-toggle-btn__icon">
        <use href={`${icons}#${isPlaying ? "pause" : "play"}`} />
      </svg>
    </button>
  );
}
