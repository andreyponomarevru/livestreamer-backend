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

  const isAuthenticated = !!auth.user;
  const hasPermission =
    auth.user?.permissions?.[props.resource] &&
    auth.user.permissions[props.resource]?.includes(props.action);

  if (isAuthenticated && hasPermission) {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return null;
  }
}
