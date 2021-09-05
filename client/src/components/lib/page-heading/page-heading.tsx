import React, { ReactElement } from "react";

import "./page-heading.scss";
import { Icon } from "../icon/icon";

interface Props {
  iconName: string;
  name: string;
}

export function PageHeading(props: Props): ReactElement {
  return (
    <div className="main-header">
      <Icon className="main-header__icon" iconName={props.iconName} />
      <h2 className="main-header__heading">{props.name}</h2>
    </div>
  );
}
