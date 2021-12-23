import * as React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuthN } from "../../hooks/use-authn";
import { ROUTES } from "../../config/routes";
import { RESOURCES, PERMISSIONS } from "../../config/constants";

interface Props extends RouteProps {
  checkPermission?: {
    action: typeof PERMISSIONS[number];
    resource: typeof RESOURCES[number];
  };
  children: React.ReactNode;
}

function ProtectedRoute(props: Props): React.ReactElement {
  const auth = useAuthN();

  const isAuthenticated = !!auth.user;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signIn} />;
  } else if (!props.checkPermission) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else if (props.checkPermission) {
    const isAuthorized = auth.user?.permissions[
      props.checkPermission.resource
    ]?.includes(props.checkPermission.action);
    return isAuthorized ? (
      <React.Fragment>{props.children}</React.Fragment>
    ) : (
      <Navigate to={ROUTES.root} replace />
    );
  } else {
    return <Navigate to={ROUTES.root} />;
  }
}

export { ProtectedRoute };
