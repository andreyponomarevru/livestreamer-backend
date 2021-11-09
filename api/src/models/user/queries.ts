import { v4 as uuidv4 } from "uuid";

import { logger } from "../../config/logger";
import { User } from "./user";
import { connectDB } from "../../config/postgres";
import { Permissions, RESOURCES, PERMISSIONS } from "../../config/constants";

type IsEmailConfirmedDBResponse = { is_email_confirmed: boolean };
type FindByEmailConfirmationTokenDBResponse = { appuser_id: number };
type UpdateLastLoginTimeDBResponse = { last_login_at: string };
type IsUserDeletedDBResponse = { is_deleted: boolean };
type ConfirmSignUpDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
};
type IsUserExistsDBResponse = { exists: boolean };
type UserPermissionsDBResponse = {
  appuser_id?: number;
  resource: typeof RESOURCES[number];
  permissions: typeof PERMISSIONS[number][];
};
interface CreateUserDBResponse {
  appuser_id: number;
}
type ReadUserDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
  password_hash: string;
  is_email_confirmed: boolean;
  is_deleted: boolean;
  created_at: string;
  last_login_at: string;
};
type CreateAllowedSettingValueDBResponse = {
  allowed_setting_value: string;
  value: string;
};
type CreateSettingDBResponse = {
  setting_id: number;
  name: string;
  is_constrained: boolean;
  data_type: string;
  value: string;
  min_value: string;
  max_value: string;
};

type DefaultUser = {
  username: string;
  password: string;
  email: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
};
type UserSetting = {
  userId: number;
  settingId: number;
  allowedSettingValueId: number;
  unconstrainedValue: string | null;
};
type AppSetting = {
  name: string;
  isConstrained: boolean;
  dataType: string;
  allowedSettingValues: string[];
};
type ConfirmedEmail = {
  userId: number;
  username: string;
  email: string;
};

type SignUpData = {
  email: string;
  username: string;
  password: string;
  roleId: number;
  isEmailConfirmed: boolean;
  emailConfirmationToken: string;
};

//

// TODO: move this function to authorization model module and retrieve permissions via service layer
async function readUserPermissions(userId: number): Promise<Permissions> {
  const sql =
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
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<UserPermissionsDBResponse>(sql, values);

  const permissions = {} as Permissions;
  res.rows.forEach((row) => {
    permissions[row.resource] = row.permissions;
  });

  return permissions;
}
// TODO: move this function to authorization model module and retrieve permissions via service layer
async function readAllUsersPermission(userId: number) {
  const sql =
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
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<UserPermissionsDBResponse[]>(sql, values);

  return res.rows;
}

async function findByUsernameOrEmail({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User | null> {
  const sql =
    "SELECT \
      appuser_id, \
      username, \
      email, \
      password_hash, \
      created_at, \
      last_login_at, \
      is_email_confirmed, \
      is_deleted \
    FROM \
      appuser \
    WHERE \
      username=$1 OR \
      email=$2";
  const values = [username, email];

  const pool = await connectDB();
  const res = await pool.query<ReadUserDBResponse>(sql, values);

  if (res.rowCount === 0) return null;

  const permissions = await readUserPermissions(res.rows[0].appuser_id);

  const user = new User({
    uuid: uuidv4(),
    id: res.rows[0].appuser_id,
    email: res.rows[0].email,
    username: res.rows[0].username,
    password: res.rows[0].password_hash,
    isEmailConfirmed: res.rows[0].is_email_confirmed,
    isDeleted: res.rows[0].is_deleted,
    createdAt: res.rows[0].created_at,
    lastLoginAt: res.rows[0].last_login_at,
    permissions,
  });

  return user;
}

async function findByEmailConfirmationToken(
  token: string,
): Promise<{ userId: number | null }> {
  const sql =
    "SELECT appuser_id FROM appuser WHERE email_confirmation_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<FindByEmailConfirmationTokenDBResponse>(
    sql,
    values,
  );

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

async function findByPasswordResetToken(
  token: string,
): Promise<{ userId: number | null }> {
  const sql = "SELECT appuser_id FROM appuser WHERE password_reset_token=$1";
  const values = [token];
  const pool = await connectDB();
  const res = await pool.query<{ appuser_id: number }>(sql, values);

  if (res.rowCount === 0) return { userId: null };
  else return { userId: res.rows[0].appuser_id };
}

async function updatePassword({
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

async function confirmEmail(userId: number): Promise<ConfirmedEmail> {
  const sql =
    "UPDATE \
      appuser \
    SET \
      is_email_confirmed = true, \
      email_confirmation_token = NULL \
    WHERE \
      appuser_id=$1 \
    RETURNING \
      appuser_id, \
      username, \
      email";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<ConfirmSignUpDBResponse>(sql, values);

  return {
    userId: res.rows[0].appuser_id,
    username: res.rows[0].username,
    email: res.rows[0].email,
  };
}

async function isUserExists({
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
  const res = await pool.query<IsUserExistsDBResponse>(sql, values);

  return res.rows[0].exists;
}

async function isEmailConfirmed({
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
  const res = await pool.query<IsEmailConfirmedDBResponse>(sql, values);

  if (res.rowCount > 0 && res.rows[0].is_email_confirmed) {
    return res.rows[0].is_email_confirmed;
  } else {
    return false;
  }
}

async function isUserDeleted({
  userId,
  email,
}: {
  userId?: number;
  email?: string;
}): Promise<boolean> {
  const sql = "SELECT is_deleted FROM appuser WHERE email=$1 OR appuser_id=$2";
  const values = [email, userId];
  const pool = await connectDB();
  const res = await pool.query<IsUserDeletedDBResponse>(sql, values);

  if (res.rowCount > 0) {
    return res.rows[0].is_deleted;
  } else {
    throw new Error(
      `No user with email "${email}" or userId "${userId}" in db`,
    );
  }
}

async function savePasswordResetToken({
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

async function createUser(signupData: SignUpData): Promise<{ userId: number }> {
  const {
    email,
    username,
    password,
    roleId,
    isEmailConfirmed,
    emailConfirmationToken,
  } = signupData;

  const sql =
    "INSERT INTO \
			appuser (role_id, username, password_hash, email, is_email_confirmed, email_confirmation_token) \
		VALUES \
			($1, $2, $3, $4, $5, $6)\
		RETURNING appuser_id";
  const values = [
    roleId,
    username,
    password,
    email,
    isEmailConfirmed,
    emailConfirmationToken,
  ];

  const pool = await connectDB();
  const res = await pool.query<CreateUserDBResponse>(sql, values);

  const user = { userId: res.rows[0].appuser_id };
  return user;
}

async function readUser(userId: number): Promise<User> {
  // TODO: include user settings in response

  const sql =
    "SELECT \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser \
		WHERE appuser_id=$1";
  const values = [userId];
  const pool = await connectDB();
  const userRes = await pool.query<ReadUserDBResponse>(sql, values);
  const permissions = await readUserPermissions(userId);

  // TODO: set uuid in service layer, it's not the responsibility of the model
  const user = new User({
    uuid: uuidv4(),
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

async function readAllUsers(): Promise<User[]> {
  const sql =
    "SELECT \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted \
		FROM appuser";

  const pool = await connectDB();
  const res = await pool.query<ReadUserDBResponse>(sql);

  const users = res.rows.map((user) => {
    return new User({
      uuid: uuidv4(),
      id: user.appuser_id,
      email: user.email,
      username: user.username,
      password: user.password_hash,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
      isEmailConfirmed: user.is_email_confirmed,
      isDeleted: user.is_deleted,
      // TODO: either add permissions to response to make it consistent with 'readUser' response or better retrieve only important data, for example  create an interface UserWithOnlyEssentialData { uuid, id, email, username }
      permissions: [] as unknown as Permissions,
    });
  });

  return users;
}

async function updateUser({
  userId,
  username,
}: {
  userId: number;
  username: string;
}): Promise<User | null> {
  const sql =
    "UPDATE \
			appuser \
		SET \
			username=$1 \
		WHERE \
			appuser_id=$2 \
		RETURNING \
			appuser_id, username, email, password_hash, created_at, last_login_at,  is_email_confirmed, is_deleted";
  const values = [username, userId];
  const pool = await connectDB();
  const res = await pool.query<ReadUserDBResponse>(sql, values);

  if (res.rowCount === 0) return null;

  const permissions = await readUserPermissions(userId);
  const user = new User({
    uuid: uuidv4(),
    id: res.rows[0].appuser_id,
    email: res.rows[0].email,
    username: res.rows[0].username,
    password: res.rows[0].password_hash,
    createdAt: res.rows[0].created_at,
    lastLoginAt: res.rows[0].last_login_at,
    isEmailConfirmed: res.rows[0].is_email_confirmed,
    isDeleted: res.rows[0].is_deleted,
    permissions,
  });

  return user;
}

async function destroyUser(userId: number): Promise<void> {
  const sql = "UPDATE appuser SET is_deleted=true WHERE appuser_id=$1";
  const values = [userId];
  const pool = await connectDB();
  await pool.query(sql, values);
}

async function updateLastLoginTime(userId: number) {
  const sql =
    "UPDATE appuser SET last_login_at=NOW() WHERE appuser_id = $1 RETURNING last_login_at";
  const values = [userId];
  const pool = await connectDB();
  const res = await pool.query<UpdateLastLoginTimeDBResponse>(sql, values);

  return { lastLoginAt: res.rows[0].last_login_at };
}

async function assignSettingToUser(usetSetting: UserSetting) {
  const sql =
    "INSERT INTO \
      appuser_setting (\
        appuser_id, \
        setting_id, \
        allowed_setting_value_id, \
        unconstrained_value\
      )\
    VALUES ($1, $2, $3, $4)";
  const values = [
    usetSetting.userId,
    usetSetting.settingId,
    usetSetting.allowedSettingValueId,
    usetSetting.unconstrainedValue,
  ];
  const pool = await connectDB();
  await pool.query(sql, values);
}

async function createAllowedSettingValue(
  settingId: number,
  valueName: string,
): Promise<void> {
  const sql =
    "INSERT INTO allowed_setting_value (setting_id, value)\
		VALUES ($1, $2) RETURNING	*";
  const values = [settingId, valueName];
  const pool = await connectDB();
  await pool.query<CreateAllowedSettingValueDBResponse>(sql, values);
}

async function createSetting(setting: AppSetting) {
  const sql =
    "INSERT INTO setting (name, is_constrained, data_type) \
    VALUES ($1, $2, $3) RETURNING *";
  const values = [setting.name, setting.isConstrained, setting.dataType];
  const pool = await connectDB();
  const settingRes = await pool.query<CreateSettingDBResponse>(sql, values);
  const settingId = settingRes.rows[0].setting_id;

  for (const valueName of setting.allowedSettingValues) {
    await createAllowedSettingValue(settingId, valueName);
  }
}

async function createDefaultUser(defaultUser: DefaultUser) {
  const sql =
    "INSERT INTO appuser (\
      username, \
      password_hash, \
      email, \
      is_email_confirmed, \
      is_deleted\
    ) \
    VALUES (\
      $1, $2, $3, $4, $5, $6\
    )";
  const values = [
    defaultUser.username,
    defaultUser.password,
    defaultUser.email,
    defaultUser.isEmailConfirmed,
    defaultUser.isDeleted,
  ];
  const pool = await connectDB();
  const res = await pool.query(sql, values);
  return res.rows;
}

export {
  updateLastLoginTime,
  destroyUser,
  updateUser,
  readAllUsers,
  readUser,
  createUser,
  savePasswordResetToken,
  isUserDeleted,
  isEmailConfirmed,
  confirmEmail,
  updatePassword,
  findByPasswordResetToken,
  findByEmailConfirmationToken,
  findByUsernameOrEmail,
  isUserExists,
  SignUpData,
};
