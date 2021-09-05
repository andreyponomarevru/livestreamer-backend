import React from "react";

import { NavBar } from "./nav-bar/nav-bar";
import { StreamBar } from "./stream-bar/stream-bar";

import "./header.scss";

export function Header(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={`header`}>
      <NavBar />
      <StreamBar />
      {props.children}
    </header>
  );
}
