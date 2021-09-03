import React, { ReactElement } from "react";

import icons from "./../../icons.svg";

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
        <svg className="stream-bar-counters__icon">
          <use href={`${icons}#users`} />
        </svg>
      </div>
      <div className="stream-bar-counters__counter">
        <span>{props.heartsCount}</span>
        <svg className="stream-bar-counters__icon">
          <use href={`${icons}#heart`} />
        </svg>
      </div>
    </div>
  );
}
