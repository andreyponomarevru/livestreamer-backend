import React, { ReactElement } from "react";
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  BrowserRouter as Router,
} from "react-router-dom";

import { Icon } from "../../../lib/icon/icon";

import "./menu.scss";

interface Props {
  isMenuOpen: boolean;
  handleToggleMenu: () => void;
  handleAutoClose: () => void;
}

export function Menu(props: Props): ReactElement {
  return (
    <ul className={`menu ${props.isMenuOpen ? "menu_open" : ""}`}>
      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
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
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/schedule"
        >
          <Icon iconName="calendar" />
          Schedule
        </NavLink>
      </li>
      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/bookmarks"
        >
          <Icon iconName="bookmark" />
          Bookmarks
        </NavLink>
      </li>
      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/users"
        >
          <Icon iconName="users" />
          Users
        </NavLink>
      </li>
      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/signin"
        >
          Sign In
        </NavLink>
      </li>
    </ul>
  );
}
