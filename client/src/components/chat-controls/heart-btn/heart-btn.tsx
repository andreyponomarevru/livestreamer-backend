import React, { ReactElement, useState } from "react";

import icons from "./../../../icons.svg";
import "./heart-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function HeartBtn(props: Props): ReactElement {
  const { className = "" } = props;

  const [isDisabled, setIsDisabled] = useState(false);

  function handleBtnClick() {
    props.handleBtnClick();

    setIsDisabled((prev) => !prev);
    setTimeout(() => {
      setIsDisabled((prev) => !prev);
    }, 5000);
  }

  return (
    <button
      disabled={isDisabled}
      className={`heart-btn ${
        isDisabled ? "heart-btn_disabled" : ""
      } ${className}`}
      onClick={handleBtnClick}
      type="submit"
      name="heart"
      value=""
    >
      <svg className="heart-btn__icon">
        <use href={`${icons}#heart`} />
      </svg>
    </button>
  );
}
