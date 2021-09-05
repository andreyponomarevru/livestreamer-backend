import React, { ReactElement } from "react";

import { Ticker } from "../../components/header/ticker/ticker";
import { Header } from "../../components/header/header";

import "./basic-layout.scss";

export function BasicLayout(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <div className="basic-layout">
      <Header>
        <Ticker />
      </Header>
      <div className="basic-layout__main">{props.children}</div>
    </div>
  );
}
