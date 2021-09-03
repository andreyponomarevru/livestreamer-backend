import React, { ReactElement } from "react";

import icons from "./../../icons.svg";
import "./like-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function LikeBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <button
      className={`like-btn ${className}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="heart"
      value=""
    >
      <svg className="like-btn__icon">
        <use href={`${icons}#like`} />
      </svg>
    </button>
  );
}
