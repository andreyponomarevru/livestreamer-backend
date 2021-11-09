import React, { PropsWithChildren, ReactElement } from "react";

import "./message.scss";

interface Props {
  className?: string;
  type: "warning" | "success" | "info" | "danger" | "info" | "disabled";
}

export function Message(props: PropsWithChildren<Props>): ReactElement {
  return (
    <span className={`message message_${props.type} ${props.className || ""}`}>
      {props.children}
    </span>
  );
}
