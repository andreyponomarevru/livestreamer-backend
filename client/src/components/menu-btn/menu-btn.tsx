import React, { ReactElement } from "react";

import icons from "./../../icons.svg";
import "./menu-btn.scss";

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
      <svg className="menu-btn__icon">
        <use
          href={`${icons}#${props.isMenuOpen ? "close" : "hamburger-menu"}`}
        />
      </svg>
    </button>
  );
}
