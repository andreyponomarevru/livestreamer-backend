import React, { ReactElement } from "react";

import { Icon } from "../icon/icon";
import "./counter.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  icon: "heart" | "users";
  idDisabled: boolean;
}

export function Counter(props: Props): ReactElement | null {
  return (
    <div className={`counter ${props.idDisabled ? "counter_disabled" : ""}`}>
      <span className="counter__number">{props.count}</span>
      <Icon iconName={props.icon} color="white" className="counter__icon" />
    </div>
  );
}
