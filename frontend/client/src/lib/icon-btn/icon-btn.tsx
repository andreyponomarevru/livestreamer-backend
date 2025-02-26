import React, { ReactElement } from "react";

import { Icon } from "../icon/icon";

import "./icon-btn.scss";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  iconName: string;
  handleBtnClick: () => void;
}

export function IconBtn(props: Props): ReactElement {
  const { className = "", iconName } = props;

  return (
    <button
      className={`icon-btn ${className}`}
      onClick={() => props.handleBtnClick()}
    >
      <Icon className="icon-btn__icon" name={iconName} />
    </button>
  );
}
