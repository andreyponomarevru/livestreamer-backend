import React, { ReactElement } from "react";
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  BrowserRouter as Router,
} from "react-router-dom";

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
          Bookmarks
        </NavLink>
      </li>
      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/account"
        >
          Account
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

      <li>
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          onClick={props.handleAutoClose}
          to="/password-reset"
        >
          Password Reset
        </NavLink>
      </li>
    </ul>
  );
}
