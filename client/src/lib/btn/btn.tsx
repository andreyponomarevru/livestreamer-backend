import React, { useState, useEffect, ReactElement } from "react";

import "./btn.scss";
import { Loader } from "../loader/loader";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  isLoading?: boolean;
  handleClick?: () => void;
  defaultText: string;
  type: "button" | "input";
  theme: "white" | "red";
}

export function Btn(props: Props): ReactElement {
  const className = `btn btn_theme_${props.theme} ${props.className || ""}`;

  if (props.type === "button") {
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
  } else {
    return (
      <input
        type="submit"
        value={props.isLoading ? "Processing..." : props.defaultText}
        className={className}
        onClick={props.handleClick ? props.handleClick : undefined}
      />
    );
  }
}
