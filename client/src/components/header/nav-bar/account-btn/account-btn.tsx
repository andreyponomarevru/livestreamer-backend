import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../../lib/icon/icon";

import "./account-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  handleAutoClose: () => void;
}

export function AccountBtn(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <NavLink
      className="account__link"
      activeClassName="account__link_active"
      onClick={props.handleAutoClose}
      to="/account"
    >
      <span
        role="button"
        className={`account-btn ${className}`}
        onClick={() => props.handleBtnClick()}
      >
        <Icon className="account-btn__icon" iconName="user-in-circle" />
      </span>
    </NavLink>
  );
}
