import React, { ReactElement } from "react";

import "./loader.scss";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  type?: "page";
}

export function Loader(props: Props): ReactElement {
  return (
    <span
      className={`loader loader_blink ${props.type ? "loader_for_page" : ""} ${
        props.className || ""
      }`}
    ></span>
  );
}
