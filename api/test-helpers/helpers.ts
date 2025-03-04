import { dbConnection } from "../src/config/postgres";
import { authnService } from "../src/services/authn";
import request from "supertest";
import { httpServer } from "../src/http-server";

export const moreInfo = { moreInfo: "https://github.com/ponomarevandrey/" };
export const response403 = {
  status: 403,
  statusText: "Forbidden",
  message: "You don't have permission to access this resource",
  ...moreInfo,
};
export const response401 = {
  status: 401,
  statusText: "Unauthorized",
  moreInfo: "https://github.com/ponomarevandrey/",
  message: "You must authenticate to access this resource",
};

type Credentials = { username: string; password: string };

export async function signIn({ username, password }: Credentials) {
  const agent = request.agent(httpServer);
  return agent
    .post("/sessions")
    .set("accept", "application/json")
    .send({ username, password });
}

export async function createUser({
  roleId,
  username,
  password,
  email,
  isEmailConfirmed,
  isDeleted,
  emailConfirmationToken,
  passwordResetToken,
}: {
  roleId: number;
  username: string;
  password: string;
  email: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  emailConfirmationToken?: string;
  passwordResetToken?: string;
}) {
  const passwordHash = await authnService.hashPassword(password);

  const pool = await dbConnection.open();
  const sql = `
      INSERT INTO appuser (
        role_id, 
        username, 
        password_hash, 
        email, 
        is_email_confirmed, 
        is_deleted,
        email_confirmation_token,
        password_reset_token
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING *`;

  const res = await pool.query(sql, [
    roleId,
    username,
    passwordHash,
    email,
    isEmailConfirmed,
    isDeleted,
    emailConfirmationToken || null,
    passwordResetToken || null,
  ]);

  return res.rows[0];
}
