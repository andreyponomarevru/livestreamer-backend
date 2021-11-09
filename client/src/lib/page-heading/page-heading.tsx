import React, { ReactElement } from "react";

import "./page-heading.scss";
import { Icon } from "../icon/icon";

interface Props {
  iconName: string;
  name: string;
}

export function PageHeading(props: Props): ReactElement {
  return (
    <div className="page-heading">
      <Icon className="page-heading__icon" iconName={props.iconName} />
      <h2 className="page-heading__heading">{props.name}</h2>
    </div>
  );
}
