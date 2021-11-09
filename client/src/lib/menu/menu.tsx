import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../lib/icon/icon";

import "./menu.scss";
import { useAuthN } from "../../hooks/use-authn";
import { ProtectedComponent } from "../../lib/protected-component/protected-component";

interface Props {
  isMenuOpen: boolean;
  handleToggleMenu: () => void;
  handleAutoClose: () => void;
}

export function Menu(props: Props): ReactElement {
  const signout = () => {
    auth.signout();
    props.handleAutoClose();
  };

  const auth = useAuthN();

  return (
    <ul className={`menu ${props.isMenuOpen ? "menu_open" : ""}`}>
      <li>
        <NavLink
          className="menu__link"
          end
          /*activeClassName=}*/
          onClick={props.handleAutoClose}
          to="/archive"
        >
          <Icon iconName="archive" />
          Archive
        </NavLink>
      </li>
      <li>
        <NavLink
          className="menu__link"
          end
          /*activeClassName="menu__link_active"*/
          onClick={props.handleAutoClose}
          to="/schedule"
        >
          <Icon iconName="calendar" />
          Schedule
        </NavLink>
      </li>
      <ProtectedComponent resource="all_user_accounts" action="read">
        <li>
          <NavLink
            className="menu__link"
            end
            /*activeClassName="menu__link_active"*/
            onClick={props.handleAutoClose}
            to="/users"
          >
            <Icon iconName="users" />
            Users
          </NavLink>
        </li>
      </ProtectedComponent>
      <ProtectedComponent resource="broadcast_draft" action="read">
        <li>
          <NavLink
            className="menu__link"
            end
            /*activeClassName="menu__link_active"*/
            onClick={props.handleAutoClose}
            to="/drafts"
          >
            <Icon iconName="pencil" />
            Drafts
          </NavLink>
        </li>
      </ProtectedComponent>
      {!auth.user ? (
        <li>
          <NavLink
            className="menu__link"
            end
            /*activeClassName="menu__link_active"*/
            onClick={props.handleAutoClose}
            to="/signin"
          >
            <Icon iconName="user" />
            Sign In
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink
            className="menu__link"
            end
            /*activeClassName="menu__link_active"*/
            onClick={signout}
            to="/signin"
          >
            <Icon iconName="logout" />
            Sign Out
          </NavLink>
        </li>
      )}
    </ul>
  );
}
