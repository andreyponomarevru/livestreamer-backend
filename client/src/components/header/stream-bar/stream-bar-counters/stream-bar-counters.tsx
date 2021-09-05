import React, { ReactElement } from "react";

import { Icon } from "../../../lib/icon/icon";

import "./stream-bar-counters.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  listenersCount: number;
  heartsCount: number;
}

export function StreamBarCounters(props: Props): ReactElement {
  const { className = "" } = props;

  return (
    <div className={`stream-bar-counters ${className}`}>
      <div className="stream-bar-counters__counter">
        <span>{props.listenersCount}</span>
        <Icon
          iconName="users"
          color="black"
          className="stream-bar-counters__icon"
        />
      </div>
      <div className="stream-bar-counters__counter">
        <span>{props.heartsCount}</span>
        <Icon
          iconName="heart"
          color="black"
          className="stream-bar-counters__icon"
        />
      </div>
    </div>
  );
}
