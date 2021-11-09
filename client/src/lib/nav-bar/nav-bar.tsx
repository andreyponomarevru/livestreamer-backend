import React, { ReactElement, useState } from "react";
import { Route, NavLink, BrowserRouter as Router } from "react-router-dom";

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
    <ul className="nav-bar">
      <li>Chat</li>
      <li>Archive</li>
      <li>Drafts</li>
      <li>Schedule</li>
      <li>Users</li>
      <li>Sign In / Sign Out</li>
      {/*<MenuBtn
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
      />*/}
    </ul>
  );
}
