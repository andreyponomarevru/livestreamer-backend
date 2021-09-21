import { PermissionNames } from "../../types";

export type SignUpData = {
  email: string;
  username: string;
  password: string;
  roleId: number;
  isEmailConfirmed: boolean;
  emailConfirmationToken: string;
};

export type ConfirmSignUpDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
};
export type UserPermissionsDBResponse = {
  appuser_id?: number;
  resource: PermissionNames;
  permissions: string[];
};
export interface CreateUserDBResponse {
  appuser_id: number;
}
export type ReadUserDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
  is_email_confirmed: boolean;
  is_deleted: boolean;
  created_at: string;
  last_login_at: string;
};
