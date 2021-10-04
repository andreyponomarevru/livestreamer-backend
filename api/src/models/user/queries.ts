import util from "util";

import pg from "pg";

import { logger } from "../../config/logger";
import { User } from "./user";
import { connectDB } from "../../config/postgres";
import { UserAccount } from "../../types";
import {
  SignUpData,
  ConfirmSignUpDBResponse,
  UserPermissionsDBResponse,
  CreateUserDBResponse,
  ReadUserDBResponse,
} from "./types";

//

export async function findByUsernameOrEmail({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User | null> {
  const selectUserSql =
    "SELECT appuser_id, username, email, password_hash, created_at, last_login_at, is_email_confirmed, is_deleted FROM appuser WHERE username=$1 OR email=$2";
  const selectUserValues = [username, email];

  const pool = await connectDB();
  const usersRes = await pool.query<{
    appuser_id: number;
    username: string;
    email: string;
    password_hash: string;
    is_email_confirmed: boolean;
    is_deleted: boolean;
    created_at: string;
    last_login_at: string;
  }>(selectUserSql, selectUserValues);

  if (usersRes.rowCount === 0) return null;

  const selectUserPermissionsSql =
    "SELECT \
			re.name AS resource, \
			array_agg(pe.name) AS permissions \
		FROM appuser AS us \
			INNER JOIN role_resource_permission AS r_r_p \
				ON us.role_id = r_r_p.role_id \
			INNER JOIN role AS rol \
				ON rol.role_id = r_r_p.role_id \
			INNER JOIN permission AS pe \
				ON pe.permission_id = r_r_p.permission_id \
			INNER JOIN resource AS re \
				ON re.resource_id = r_r_p.resource_id \
		WHERE us.appuser_id=$1 \
		GROUP BY \
			r_r_p.resource_id, \
			re.name, \
			us.username";
  const selectUserPermissionsValues = [usersRes.rows[0].appuser_id];
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsSql,
    selectUserPermissionsValues,
  );

  const permissions: { [key: string]: string[] } = {};
  userPermissionsRes.rows.forEach((row) => {
    permissions[row.resource] = row.permissions;
  });

  const user = new User({
    id: usersRes.rows[0].appuser_id,
    email: usersRes.rows[0].email,
    username: usersRes.rows[0].username,
    password: usersRes.rows[0].password_hash,
    isEmailConfirmed: usersRes.rows[0].is_email_confirmed,
    isDeleted: usersRes.rows[0].is_deleted,
    createdAt: usersRes.rows[0].created_at,
    lastLoginAt: usersRes.rows[0].last_login_at,
    permissions,
  });

  return user;
}

export async function findByEmailConfirmationToken(
  token: string,
): Promise<{ userId: number | null }> {
  const sql =
    "SELECT appuser_id FROM appuser WHERE email_confirmation_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<{ appuser_id: number }>(sql, values);

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

export async function findByPasswordResetToken(
  token: string,
): Promise<{ userId: number | null }> {
  const sql = "SELECT appuser_id FROM appuser WHERE password_reset_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<{ appuser_id: number }>(sql, values);

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

export async function updatePassword({
  userId,
  newPassword,
}: {
  userId: number;
  newPassword: string;
}): Promise<void> {
  const deletePassResetTokenSql =
    "UPDATE appuser SET password_reset_token=NULL WHERE appuser_id=$1";
  const deletePassResetTokenValues = [userId];

  const saveNewPasswordSql = "UPDATE appuser SET password_hash=$1";
  const saveNewPasswordValues = [newPassword];

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(deletePassResetTokenSql, deletePassResetTokenValues);
    await client.query(saveNewPasswordSql, saveNewPasswordValues);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: [updatePassword] ROLLBACK. Can't update password.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function confirmEmail(userId: number): Promise<{
  userId: number;
  username: string;
  email: string;
}> {
  const sql =
    "UPDATE appuser SET is_email_confirmed=true, email_confirmation_token=NULL WHERE appuser_id=$1 RETURNING appuser_id, username, email";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<ConfirmSignUpDBResponse>(sql, values);

  return {
    userId: res.rows[0].appuser_id,
    username: res.rows[0].username,
    email: res.rows[0].email,
  };
}

export async function isUserExists({
  userId,
  username,
  email,
}: {
  userId?: number;
  username?: string;
  email?: string;
}): Promise<boolean> {
  const sql =
    "SELECT \
			EXISTS (\
				SELECT 1 FROM appuser WHERE appuser_id=$1 OR username=$2 OR email=$3\
			)";
  const values = [userId, username, email];
  const pool = await connectDB();
  const res = await pool.query<{ exists: boolean }>(sql, values);

  return res.rows[0].exists;
}

export async function isEmailConfirmed({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  const sql =
    "SELECT is_email_confirmed FROM appuser WHERE email=$1 OR appuser_id=$2";
  const values = [email, userId];
  const pool = await connectDB();
  const res = await pool.query<{ is_email_confirmed: boolean }>(sql, values);

  if (res.rowCount > 0 && res.rows[0].is_email_confirmed) {
    return res.rows[0].is_email_confirmed;
  } else {
    return false;
  }
}

export async function isUserDeleted({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  const sql = "SELECT is_deleted FROM appuser WHERE email=$1 OR appuser_id=$2";
  const values = [email, userId];
  const pool = await connectDB();
  const res = await pool.query<{ is_deleted: boolean }>(sql, values);

  if (res.rowCount > 0) {
    return res.rows[0].is_deleted;
  } else {
    throw new Error(
      `No user with email "${email}" or userId "${userId}" in db`,
    );
  }
}

export async function savePasswordResetToken({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<void> {
  const sql = "UPDATE appuser SET password_reset_token=$1 WHERE email=$2";
  const values = [token, email];
  const pool = await connectDB();
  await pool.query(sql, values);
}

export async function createUser(
  signupData: SignUpData,
): Promise<{ userId: number }> {
  const {
    email,
    username,
    password,
    roleId,
    isEmailConfirmed,
    emailConfirmationToken,
  } = signupData;

  const insertUserSql =
    "INSERT INTO \
			appuser (role_id, username, password_hash, email, is_email_confirmed, email_confirmation_token) \
		VALUES \
			($1, $2, $3, $4, $5, $6)\
		RETURNING appuser_id";
  const insertUserValues = [
    roleId,
    username,
    password,
    email,
    isEmailConfirmed,
    emailConfirmationToken,
  ];

  // TODO: allow passing user settings from service layer
  const insertUserSettingsSql =
    "INSERT INTO \
			appuser_setting (appuser_id, setting_id, allowed_setting_value_id, 	unconstrained_value)\
		VALUES (1, 1, 1, NULL)";
  const insertUserSettingsValues = [];

  const pool = await connectDB();
  const res = await pool.query<CreateUserDBResponse>(
    insertUserSql,
    insertUserValues,
  );

  const user = { userId: res.rows[0].appuser_id };
  return user;
}

export async function readUser(userId: number): Promise<User> {
  // TODO: include user settings in response

  const selectUserSql =
    "SELECT \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser \
		WHERE appuser_id=$1";
  const selectUserProfileValues = [userId];

  const selectUserPermissionsSql =
    "SELECT \
			re.name AS resource, \
			array_agg(pe.name) AS permissions \
		FROM appuser AS us \
			INNER JOIN role_resource_permission AS r_r_p \
				ON us.role_id = r_r_p.role_id \
			INNER JOIN role AS rol \
				ON rol.role_id = r_r_p.role_id \
			INNER JOIN permission AS pe \
				ON pe.permission_id = r_r_p.permission_id \
			INNER JOIN resource AS re \
				ON re.resource_id = r_r_p.resource_id \
		WHERE us.appuser_id=$1 \
		GROUP BY \
			r_r_p.resource_id, \
			re.name, \
			us.username";
  const selectUserPermissionsValues = [userId];

  const pool = await connectDB();
  const userRes = await pool.query<ReadUserDBResponse>(
    selectUserSql,
    selectUserProfileValues,
  );
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsSql,
    selectUserPermissionsValues,
  );

  const permissions: { [key: string]: string[] } = {};
  userPermissionsRes.rows.forEach((row) => {
    permissions[row.resource] = row.permissions;
  });

  const user = new User({
    id: userRes.rows[0].appuser_id,
    email: userRes.rows[0].email,
    username: userRes.rows[0].username,
    password: userRes.rows[0].password_hash,
    createdAt: userRes.rows[0].created_at,
    lastLoginAt: userRes.rows[0].last_login_at,
    isEmailConfirmed: userRes.rows[0].is_email_confirmed,
    isDeleted: userRes.rows[0].is_deleted,
    permissions,
  });

  return user;
}

export async function readAllUsers(): Promise<User[]> {
  const selectUserSql =
    "SELECT \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser";
  const selectUserPermissionsSql =
    "SELECT \
			us.appuser_id, \
			re.name AS resource, \
			array_agg(pe.name) AS permissions \
		FROM appuser AS us \
			INNER JOIN role_resource_permission AS r_r_p \
				ON us.role_id = r_r_p.role_id \
			INNER JOIN role AS rol \
				ON rol.role_id = r_r_p.role_id \
			INNER JOIN permission AS pe \
				ON pe.permission_id = r_r_p.permission_id \
			INNER JOIN resource AS re \
				ON re.resource_id = r_r_p.resource_id \
		GROUP BY \
			r_r_p.resource_id, \
			re.name, \
			us.username,\
			us.appuser_id";
  const pool = await connectDB();
  const usersRes = await pool.query<ReadUserDBResponse>(selectUserSql);
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsSql,
  );

  if (usersRes.rowCount === 0) {
    return [];
  } else {
    const users = usersRes.rows.map((userRow) => {
      const permissions: { [key: string]: string[] } = {};
      userPermissionsRes.rows.forEach((permissionsRow) => {
        if (permissionsRow.appuser_id !== userRow.appuser_id) return;
        else permissions[permissionsRow.resource] = permissionsRow.permissions;
      });
      return new User({
        id: userRow.appuser_id,
        email: userRow.email,
        username: userRow.username,
        password: userRow.password_hash,
        createdAt: userRow.created_at,
        lastLoginAt: userRow.last_login_at,
        isEmailConfirmed: userRow.is_email_confirmed,
        isDeleted: userRow.is_deleted,
        permissions,
      });
    });

    return users;
  }
}

export async function updateUser({
  userId,
  username,
}: {
  userId: number;
  username: string;
}): Promise<User | null> {
  // TODO: refactor into a single query

  const updateUserSql =
    "UPDATE \
			appuser \
		SET \
			username=$1 \
		WHERE \
			appuser_id=$2 \
		RETURNING \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted";
  const updateUserValues = [username, userId];

  const selectUserPermissionsSql =
    "SELECT \
			re.name AS resource, \
			array_agg(pe.name) AS permissions \
		FROM appuser AS us \
			INNER JOIN role_resource_permission AS r_r_p \
				ON us.role_id = r_r_p.role_id \
			INNER JOIN role AS rol \
				ON rol.role_id = r_r_p.role_id \
			INNER JOIN permission AS pe \
				ON pe.permission_id = r_r_p.permission_id \
			INNER JOIN resource AS re \
				ON re.resource_id = r_r_p.resource_id \
		WHERE us.appuser_id=$1 \
		GROUP BY \
			r_r_p.resource_id, \
			re.name, \
			us.username";
  const userPermissionsValues = [userId];

  const pool = await connectDB();
  const updatedUserRes = await pool.query<ReadUserDBResponse>(
    updateUserSql,
    updateUserValues,
  );
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsSql,
    userPermissionsValues,
  );

  if (updatedUserRes.rowCount > 0) {
    const permissions: { [key: string]: string[] } = {};
    userPermissionsRes.rows.forEach((row) => {
      permissions[row.resource] = row.permissions;
    });

    const user = new User({
      id: updatedUserRes.rows[0].appuser_id,
      email: updatedUserRes.rows[0].email,
      username: updatedUserRes.rows[0].username,
      password: updatedUserRes.rows[0].password_hash,
      createdAt: updatedUserRes.rows[0].created_at,
      lastLoginAt: updatedUserRes.rows[0].last_login_at,
      isEmailConfirmed: updatedUserRes.rows[0].is_email_confirmed,
      isDeleted: updatedUserRes.rows[0].is_deleted,
      permissions,
    });

    return user;
  } else {
    return null;
  }
}

export async function destroyUser(userId: number): Promise<void> {
  const sql = "UPDATE appuser SET is_deleted=true WHERE appuser_id=$1";
  const values = [userId];
  const pool = await connectDB();
  await pool.query(sql, values);
}

export async function updateLastLoginTime(userId: number) {
  const sql =
    "UPDATE appuser SET last_login_at=NOW() WHERE appuser_id = $1 RETURNING last_login_at";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<{ last_login_at: string }>(sql, values);

  return { lastLoginAt: res.rows[0].last_login_at };
}
