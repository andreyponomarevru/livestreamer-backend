import React, { PropsWithChildren } from "react";

import "./error.scss";

interface Props {
  className?: string;
}

export function Error(props: PropsWithChildren<Props>): React.ReactNode {
  const { className = "", children } = props;

  return <span className={`error ${className}`}>{children}</span>;
}
