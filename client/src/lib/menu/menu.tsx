import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../lib/icon/icon";

import "./menu.scss";
import { useAuthN } from "../../hooks/use-authn";
import { ProtectedComponent } from "../../lib/protected-component/protected-component";
import { useIsMounted } from "../../hooks/use-is-mounted";

interface Props {
  isOpen: boolean;
}

export function Menu(props: Props): ReactElement {
  const auth = useAuthN();

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
      <ProtectedComponent resource="all_user_accounts" action="read">
        <li>
          <NavLink className="menu__link" end to="/users">
            <Icon name="users" />
            Users
          </NavLink>
        </li>
      </ProtectedComponent>
      <ProtectedComponent resource="broadcast_draft" action="read">
        <li>
          <NavLink className="menu__link" end to="/drafts">
            <Icon name="pencil" />
            Drafts
          </NavLink>
        </li>
      </ProtectedComponent>
      {!auth.user ? (
        <li>
          <NavLink className="menu__link" end to="/signin">
            <Icon name="user" />
            Sign In
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink
            className="menu__link"
            end
            onClick={() => auth.signout()}
            to="/signin"
          >
            <Icon name="logout" />
            Sign Out
          </NavLink>
        </li>
      )}
    </ul>
  );
}
