import React, { ReactElement, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  BrowserRouter as Router,
} from "react-router-dom";

import { Logo } from "./logo/logo";
import { MenuBtn } from "./menu-btn/menu-btn";
import { Menu } from "./menu/menu";
import { AccountBtn } from "./account-btn/account-btn";

import "./nav-bar.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function NavBar(props: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleMenu() {
    setIsOpen((prev) => !prev);
  }

  // Close menu when you click a menu item
  function handleAutoCloseMenu() {
    setIsOpen(false);
  }

  return (
    <nav className="nav-bar">
      <MenuBtn
        className="nav-bar__menu-btn"
        handleBtnClick={handleToggleMenu}
        isMenuOpen={isOpen}
      />
      <Menu
        isMenuOpen={isOpen}
        handleToggleMenu={handleToggleMenu}
        handleAutoClose={handleAutoCloseMenu}
      />
      <Logo
        handleAutoClose={handleAutoCloseMenu}
        className="nav-bar__logo"
        fill="white"
        height="1.4rem"
      />
      <AccountBtn
        className="nav-bar__account-btn"
        handleBtnClick={handleToggleMenu}
        handleAutoClose={() => handleAutoCloseMenu()}
      />
    </nav>
  );
}
