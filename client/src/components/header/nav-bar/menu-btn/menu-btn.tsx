import React, { ReactElement } from "react";

import icons from "./../../../icons.svg";
import "./menu-btn.scss";
import { Icon } from "../../../lib/icon/icon";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isMenuOpen: boolean;
}

export function MenuBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <button
      className={`menu-btn ${className}`}
      onClick={() => props.handleBtnClick()}
    >
      <Icon
        className="menu-btn__icon"
        iconName={`${props.isMenuOpen ? "close" : "hamburger-menu"}`}
      />
    </button>
  );
}
