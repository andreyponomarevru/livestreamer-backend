import React, { ReactElement } from "react";

import icons from "./../../icons.svg";

import "./icon.scss";

interface Props extends React.HTMLAttributes<SVGAElement> {
  iconName: string;
  color?: "black" | "white" | "grey";
}

export function Icon(props: Props): ReactElement {
  const { className = "", color = "white" } = props;

  const colorClassName = `icon_fill_${color}`;

  return (
    <svg className={`icon ${colorClassName} ${className}`}>
      <use href={`${icons}#${props.iconName}`} />
    </svg>
  );
}
