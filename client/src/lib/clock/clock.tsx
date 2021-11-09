import React, { ReactElement } from "react";

import { useWSTimer } from "../../hooks/use-ws-timer";

import "./clock.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startAt: string;
  className?: string;
}

export function Clock(props: Props): ReactElement {
  const timePassed = useWSTimer(props.startAt);

  return <span className={`clock ${props.className}`}>{timePassed}</span>;
}
