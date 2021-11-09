import React, {
  useContext,
  Fragment,
  ReactElement,
  ReactFragment,
} from "react";

import { useAuthN } from "../../hooks/use-authn";
import { RESOURCES, PERMISSIONS } from "../../config/constants";

interface Props extends React.HTMLAttributes<ReactFragment> {
  resource: typeof RESOURCES[number];
  action: typeof PERMISSIONS[number];
  children: React.ReactNode;
}

export function ProtectedComponent(props: Props): JSX.Element | null {
  const auth = useAuthN();

  if (
    auth.user &&
    auth.user.permissions &&
    auth.user.permissions[props.resource] &&
    auth.user.permissions[props.resource]?.includes(props.action)
  ) {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return null;
  }
}
