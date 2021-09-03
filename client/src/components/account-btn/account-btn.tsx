import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import icons from "./../../icons.svg";
import "./account-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  handleAutoClose: () => void;
}

export function AccountBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <NavLink
      className="menu__link"
      activeClassName="menu__link_active"
      onClick={props.handleAutoClose}
      to="/account"
    >
      <button
        className={`account-btn ${className}`}
        onClick={() => props.handleBtnClick()}
      >
        <svg className="account-btn__icon">
          <use href={`${icons}#user-01`} />
        </svg>
      </button>
    </NavLink>
  );
}
