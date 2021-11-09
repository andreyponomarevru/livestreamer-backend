import React, {
  FC,
  useContext,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthN } from "../../hooks/use-authn";
import { useIsMounted } from "../../hooks/use-is-mounted";

// TODO: cant't find any info about extending Route type, google
/*interface Props extends Route {
  isLoggedIn: boolean;
  component: FC<any>;
  hasPermission?: boolean;
  path: string;
}*/

export function ProtectedRoute(props: any) {
  const { component: Component, hasPermission = false, ...rest } = props;

  const { user } = useAuthN();

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (user && hasPermission) {
          return <Component {...rest} {...props} />;
        } else if (user && !hasPermission) {
          const to = { pathname: "/", state: { from: props.location } };
          return <Navigate to={to} />;
        } else {
          const to = { pathname: "/signin", state: { from: props.location } };
          return <Navigate to={to} />;
        }
      }}
    />
  );
}
