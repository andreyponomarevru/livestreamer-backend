import * as React from "react";

import "./page.scss";

function Page(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`page ${props.className || ""}`}>{props.children}</div>
  );
}

export { Page };
