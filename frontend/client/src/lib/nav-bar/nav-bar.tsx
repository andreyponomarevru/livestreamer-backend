import React, { ReactElement, useState, useEffect } from "react";
import {
  Route,
  NavLink,
  BrowserRouter as Router,
  Link,
  useLocation,
} from "react-router-dom";

import "./nav-bar.scss";

import { Icon } from "../../lib/icon/icon";
import { useAuthN } from "../../hooks/use-authn";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Menu } from "../../lib/menu/menu";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function NavBar(props: Props): ReactElement {
  function handleToggleMenu() {
    console.log("[handleToggleMenu] toggle menu");
    setIsOpen((prev) => !prev);
  }

  const location = useLocation();
  const isMounted = useIsMounted();
  const auth = useAuthN();

  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (isMounted && isOpen) {
      setIsOpen(false);
    }
  }, [location]);

  return (
    <nav className="nav-bar">
      <button onClick={handleToggleMenu} className="nav-bar__btn">
        {isOpen ? (
          <Icon name="close" color="white" className="nav-bar__menu-icon" />
        ) : (
          <Icon name="hamburger" color="white" className="nav-bar__menu-icon" />
        )}
      </button>

      <Link to="/" className="nav-bar__link nav-bar__logo">
        LiveStreamer
      </Link>

      <Link to={auth.user ? "/account" : "/signin"}>
        <Icon
          name="user-in-circle"
          color="white"
          className="nav-bar__user-profile-icon"
        />
      </Link>

      <Menu isOpen={isOpen} />
    </nav>
  );
}
