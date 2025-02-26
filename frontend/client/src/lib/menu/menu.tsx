import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../lib/icon/icon";

import "./menu.scss";
import { useAuthN } from "../../hooks/use-authn";
import { hasPermission } from "../../utils/has-permission";
import { useSignOut } from "../../hooks/use-sign-out";

interface Props {
  isOpen: boolean;
}

export function Menu(props: Props): ReactElement {
  const auth = useAuthN();
  const { signOut } = useSignOut();

  return (
    <ul className={`menu ${props.isOpen ? "menu_open" : ""}`}>
      <li>
        <NavLink className="menu__link" end to="/archive">
          <Icon name="archive" />
          Archive
        </NavLink>
      </li>
      <li>
        <NavLink className="menu__link" end to="/schedule">
          <Icon name="calendar" />
          Schedule
        </NavLink>
      </li>
      {hasPermission(
        { resource: "all_user_accounts", action: "read" },
        auth.user
      ) && (
        <li>
          <NavLink className="menu__link" end to="/users">
            <Icon name="users" />
            Users
          </NavLink>
        </li>
      )}
      {hasPermission(
        { resource: "broadcast_draft", action: "read" },
        auth.user
      ) && (
        <li>
          <NavLink className="menu__link" end to="/drafts">
            <Icon name="pencil" />
            Drafts
          </NavLink>
        </li>
      )}
      {!auth.user ? (
        <li>
          <NavLink className="menu__link" end to="/signin">
            <Icon name="user" />
            Sign In
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink className="menu__link" end onClick={signOut} to="/signin">
            <Icon name="logout" />
            Sign Out
          </NavLink>
        </li>
      )}
    </ul>
  );
}
