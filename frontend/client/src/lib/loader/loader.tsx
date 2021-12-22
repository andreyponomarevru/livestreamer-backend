import React, { ReactElement } from "react";

import "./loader.scss";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  for?: "page" | "btn";
  color: "white" | "black" | "pink";
}

export function Loader(props: Props): ReactElement {
  return (
    <span
      className={`loader loader_blink loader_color_${props.color} ${
        props.for ? `loader_for_${props.for}` : ""
      } ${props.className || ""}`}
    ></span>
  );
}
