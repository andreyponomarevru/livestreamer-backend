import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../icon/icon";

import "./account-btn.scss";
import { useAuthN } from "../../hooks/use-authn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  handleAutoClose: () => void;
}

export function AccountBtn(props: Props): ReactElement {
  const { user } = useAuthN();

  const { className = "" } = props;

  return (
    <NavLink
      className="account__link"
      /*activeClassName="account__link_active"*/
      onClick={props.handleAutoClose}
      to={user ? "/account" : "/signin"}
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
