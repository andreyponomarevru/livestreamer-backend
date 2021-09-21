import util from "util";

import pg from "pg";

import { logger } from "../../config/logger";
import { User } from "./user";
import { connectDB } from "../../config/postgres";
import { Profile, PermissionNames, Permissions } from "../../types";
import {
  SignUpData,
  ConfirmSignUpDBResponse,
  UserPermissionsDBResponse,
  CreateUserDBResponse,
  ReadUserDBResponse,
} from "./types";

//

export async function findByEmailConfirmationToken(
  token: string,
): Promise<{ userId: number | null }> {
  const query =
    "SELECT appuser_id FROM appuser WHERE email_confirmation_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<{ appuser_id: number }>(query, values);

  logger.debug(
    `${__filename} [findByEmailConfirmationToken] ${util.inspect(res.rows)}`,
  );

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

export async function findByPasswordResetToken(
  token: string,
): Promise<{ userId: number | null }> {
  const query = "SELECT appuser_id FROM appuser WHERE password_reset_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<{ appuser_id: number }>(query, values);

  logger.debug(
    `${__filename} [findByPasswordResetToken] ${util.inspect(res.rows)}`,
  );

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

export async function updatePassword({
  userId,
  newPassword,
}: {
  userId: number;
  newPassword: string;
}) {
  const deletePassResetTokenQuery =
    "UPDATE appuser SET password_reset_token=NULL WHERE appuser_id=$1";
  const deletePassResetTokenValues = [userId];

  const saveNewPasswordQuery = "UPDATE appuser SET password_hash=$1";
  const saveNewPasswordValues = [newPassword];

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(deletePassResetTokenQuery, deletePassResetTokenValues);
    await client.query(saveNewPasswordQuery, saveNewPasswordValues);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: [updatePassword] ROLLBACK. Can't update password.`,
    );
    throw err;
  } finally {
    client.release();
    logger.debug(`${__filename} [updatePassword]`);
  }
}

export async function confirmEmail(userId: number) {
  const query =
    "UPDATE appuser SET is_email_confirmed=true, email_confirmation_token=NULL WHERE appuser_id=$1 RETURNING appuser_id, username, email";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<ConfirmSignUpDBResponse>(query, values);

  logger.debug(`${__filename}: [confirmEmail]`);

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
  const query =
    "SELECT EXISTS (SELECT 1 FROM appuser WHERE appuser_id=$1 OR username=$2 OR email=$3)";
  const values = [userId, username, email];

  const pool = await connectDB();
  const res = await pool.query<{ exists: boolean }>(query, values);

  logger.debug(`${__filename}: [isUserExists] ${res.rows[0].exists}`);

  return res.rows[0].exists;
}

export async function isEmailConfirmed({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  const query =
    "SELECT is_email_confirmed FROM appuser WHERE email=$1 OR appuser_id=$2";
  const values = [email, userId];
  const pool = await connectDB();
  const res = await pool.query<{ is_email_confirmed: boolean }>(query, values);

  logger.debug(`${__filename}: [isEmailConfirmed] ${util.inspect(res.rows)}`);

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
  const query =
    "SELECT is_deleted FROM appuser WHERE email=$1 OR appuser_id=$2";
  const values = [email, userId];
  const pool = await connectDB();
  const res = await pool.query<{ is_deleted: boolean }>(query, values);

  logger.debug(`${__filename}: [isUserDeleted] ${util.inspect(res.rows)}`);

  if (res.rowCount > 0) {
    return res.rows[0].is_deleted;
  } else {
    throw new Error(
      `No user corresponding to email "${email}" or userId "${userId}" in db.`,
    );
  }
}

export async function savePasswordResetToken({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const query = "UPDATE appuser SET password_reset_token=$1 WHERE email=$2";
  const values = [token, email];
  const pool = await connectDB();
  await pool.query(query, values);

  logger.debug(`${__filename}: [savePasswordResetToken]`);
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

  const insertUserQuery =
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

  // TODO: implement user setting in service layer
  const insertUserSettingsQuery =
    "INSERT INTO \
			appuser_setting (appuser_id, setting_id, allowed_setting_value_id, 	unconstrained_value)\
		VALUES (1, 1, 1, NULL)";
  const values = [];

  const pool = await connectDB();
  const res = await pool.query<CreateUserDBResponse>(
    insertUserQuery,
    insertUserValues,
  );

  logger.debug(`${__filename} [createUser] ${util.inspect(res.rows)}`);

  const newUser = { userId: res.rows[0].appuser_id };
  return newUser;
}

export async function readUser(userId: number) {
  // TODO: cache this response and check props like is_deleted, etc. in Redis
  // TODO: include user settings in response

  const selectUserProfileQuery =
    "SELECT \
			appuser_id, username, email, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser \
		WHERE appuser_id=$1";
  const selectUserPermissionsQuery =
    "SELECT \
			re.name AS resource, \
			jsonb_agg(pe.name) AS permissions \
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

  const values = [userId];
  const pool = await connectDB();
  const userProfileRes = await pool.query<ReadUserDBResponse>(
    selectUserProfileQuery,
    values,
  );
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsQuery,
    values,
  );

  logger.debug(`${__filename}: [readUser]`);

  const permissions = {} as Permissions;
  userPermissionsRes.rows.forEach((row) => {
    permissions[row.resource] = row.permissions;
  });

  const profile = new User({
    id: userProfileRes.rows[0].appuser_id,
    email: userProfileRes.rows[0].email,
    username: userProfileRes.rows[0].username,
    createdAt: userProfileRes.rows[0].created_at,
    lastLoginAt: userProfileRes.rows[0].last_login_at,
    isEmailConfirmed: userProfileRes.rows[0].is_email_confirmed,
    isDeleted: userProfileRes.rows[0].is_deleted,
    permissions,
  });

  return profile;
}

export async function readAllUsers() {
  const selectUserProfilesQuery =
    "SELECT \
			appuser_id, username, email, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser";
  const selectUserPermissionsQuery =
    "SELECT \
			us.appuser_id, \
			re.name AS resource, \
			jsonb_agg(pe.name) AS permissions \
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
  const userProfilesRes = await pool.query<ReadUserDBResponse>(
    selectUserProfilesQuery,
  );
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsQuery,
  );

  logger.debug(`${__filename}: [readAllUsers]`);

  if (userProfilesRes.rowCount === 0) {
    return [];
  } else {
    const users = userProfilesRes.rows.map((userRow) => {
      const permissions = {} as Permissions;
      userPermissionsRes.rows.forEach((permissionsRow) => {
        if (permissionsRow.appuser_id !== userRow.appuser_id) return;
        else permissions[permissionsRow.resource] = permissionsRow.permissions;
      });
      return new User({
        id: userRow.appuser_id,
        email: userRow.email,
        username: userRow.username,
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
}) {
  // TODO: refactor into a single query

  const updateUserQuery =
    "UPDATE \
			appuser \
		SET \
			username=$1 \
		WHERE \
			appuser_id=$2 \
		RETURNING \
			appuser_id, username, email, created_at, last_login_at,  is_email_confirmed, is_deleted";
  const updateUserValues = [username, userId];

  const selectUserPermissionsQuery =
    "SELECT \
			re.name AS resource, \
			jsonb_agg(pe.name) AS permissions \
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
  const updateUserRes = await pool.query<ReadUserDBResponse>(
    updateUserQuery,
    updateUserValues,
  );
  const userPermissionsRes = await pool.query<UserPermissionsDBResponse>(
    selectUserPermissionsQuery,
    userPermissionsValues,
  );

  if (updateUserRes.rowCount > 0) {
    const permissions = {} as Permissions;
    userPermissionsRes.rows.forEach((row) => {
      permissions[row.resource] = row.permissions;
    });

    const profile = new User({
      id: updateUserRes.rows[0].appuser_id,
      email: updateUserRes.rows[0].email,
      username: updateUserRes.rows[0].username,
      createdAt: updateUserRes.rows[0].created_at,
      lastLoginAt: updateUserRes.rows[0].last_login_at,
      isEmailConfirmed: updateUserRes.rows[0].is_email_confirmed,
      isDeleted: updateUserRes.rows[0].is_deleted,
      permissions,
    });

    return profile;
  } else {
    return null;
  }
}

export async function destroyUser(userId: number) {
  const query = "UPDATE appuser SET is_deleted=true WHERE appuser_id=$1";
  const values = [userId];
  const pool = await connectDB();
  await pool.query(query, values);

  logger.debug(`${__filename}: [destroyUser]`);
}
