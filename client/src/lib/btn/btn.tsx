import React, { useState, useEffect, ReactElement } from "react";

import "./btn.scss";
import { Loader } from "../loader/loader";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  isLoading?: boolean;
  handleClick?: () => void;
  defaultText: string;
  theme: "white" | "red";
}

function Btn(props: Props): ReactElement {
  const className = `btn btn_theme_${props.theme} ${props.className || ""}`;

  return (
    <button
      onClick={props.handleClick ? props.handleClick : undefined}
      className={className}
    >
      {props.isLoading ? (
        <Loader className="btn__loader btn__loader_white" />
      ) : (
        <span className={props.className || ""}>{props.defaultText}</span>
      )}
    </button>
  );
}

export { Btn };
