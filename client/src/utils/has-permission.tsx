import { UserState } from "../hooks/use-authn";
import { RESOURCES, PERMISSIONS } from "../config/constants";

interface HasPermission {
  action: typeof PERMISSIONS[number];
  resource: typeof RESOURCES[number];
}

function hasPermission(
  checkPermission: HasPermission,
  user?: UserState
): boolean {
  const isAuthenticated = !!user;
  const hasPermission = !!(
    user?.permissions?.[checkPermission.resource] &&
    user.permissions[checkPermission.resource]?.includes(checkPermission.action)
  );

  return isAuthenticated && hasPermission;
}

export { hasPermission };
