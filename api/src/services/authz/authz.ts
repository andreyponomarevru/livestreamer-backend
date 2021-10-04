import { User } from "../../models/user/user";

export async function isAllowed(user: User, action: string, resource: string) {
  return user.permissions[resource].includes(action);
}

export async function isResourceOwner(
  sessionUserId: number,
  requestUserId: number,
) {
  return sessionUserId === requestUserId;
}
