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
  resource: string;
  permissions: string[];
};
export interface CreateUserDBResponse {
  appuser_id: number;
}
export type ReadUserDBResponse = {
  appuser_id: number;
  role_id: number;
  username: string;
  email: string;
  password_hash: string;
  is_email_confirmed: boolean;
  is_deleted: boolean;
  created_at: string;
  last_login_at: string;
};
