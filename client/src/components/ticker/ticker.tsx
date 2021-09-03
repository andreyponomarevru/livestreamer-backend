import React, { ReactElement } from "react";

import "./ticker.scss";

interface TickerProps {
  className?: string;
}

export function Ticker(props: TickerProps): ReactElement {
  const { className = "" } = props;

  return <h2 className={`ticker ${className}`}>TEST STREAM</h2>;
}
