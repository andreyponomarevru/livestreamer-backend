import React, { ReactElement } from "react";

import icons from "./../../../icons.svg";
import "./delete-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function DeleteBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <button
      className={`delete-btn ${className}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="delete"
      value=""
    >
      <svg className="delete-btn__icon">
        <use href={`${icons}#trash-can`} />
      </svg>
    </button>
  );
}
