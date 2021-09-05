import React, { useState } from "react";

import icons from "./../../../../../icons.svg";

import "./play-toggle-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isPlaying: boolean;
}

export function PlayToggleBtn(props: Props): JSX.Element {
  const iconClassName = props.isPlaying ? "play-toggle-btn__icon_disabled" : "";

  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    setIsPlaying((prev) => !prev);

    props.handleBtnClick();
  }

  return (
    <button className="play-toggle-btn" onClick={handleClick}>
      <svg className={`play-toggle-btn__icon ${iconClassName}`}>
        <use href={`${icons}#${isPlaying ? "pause" : "play"}`} />
      </svg>
    </button>
  );
}
