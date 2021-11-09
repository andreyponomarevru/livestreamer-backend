import React, { ReactElement } from "react";

import "./scheduled-broadcast.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  startAt: string;
  endAt: string;
}

export function ScheduledBroadcast(props: Props): ReactElement {
  return (
    <li className={`scheduled-broadcast ${props.className || ""}`}>
      <span className="scheduled-broadcast__start">{props.startAt}</span>
      <span>—</span>
      <span className="scheduled-broadcast__end">{props.endAt}</span>
    </li>
  );
}
