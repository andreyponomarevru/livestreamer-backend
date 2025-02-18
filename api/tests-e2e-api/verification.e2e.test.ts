import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";

const unconfirmedUser = {
  roleId: 2,
  username: "ivanivanovich",
  email: "ivan@ivanovich.ru",
  passwordHash: "pass-hash",
  emailConfirmationToken: "123456789",
};

async function seedUser({
  roleId,
  username,
  email,
  passwordHash,
  emailConfirmationToken,
}: typeof unconfirmedUser) {
  const pool = await dbConnection.open();
  await pool.query(`
        INSERT INTO appuser (
          role_id,
          username, 
          email, 
          password_hash, 
          email_confirmation_token
        ) 
        VALUES (
          ${roleId},
          '${username}', 
          '${email}', 
          '${passwordHash}', 
          '${emailConfirmationToken}'
        )`);
}

describe("/verification", () => {
  describe("POST - confirm user sign up by sending a token from email link", () => {
    it("confirms the user sign up if the token is valid", async () => {
      await seedUser(unconfirmedUser);

      await request(httpServer)
        .post(`/verification?token=${unconfirmedUser.emailConfirmationToken}`)
        .expect(204);

      const pool = await dbConnection.open();
      const confirmedUser = await pool.query(
        `SELECT * FROM appuser WHERE username = '${unconfirmedUser.username}'`,
      );

      expect(confirmedUser.rows).toStrictEqual([
        {
          appuser_id: expect.any(Number),
          role_id: 2,
          username: "ivanivanovich",
          password_hash: "pass-hash",
          email: "ivan@ivanovich.ru",
          created_at: expect.any(Date),
          last_login_at: null,
          is_deleted: false,
          is_email_confirmed: true,
          email_confirmation_token: null,
          password_reset_token: null,
        },
      ]);
    });
  });

  it("doesn't confirm the user sign up if the token is invalid", async () => {
    await seedUser(unconfirmedUser);

    await request(httpServer)
      .post(`/verification?token=invalid-token`)
      .expect(401);
  });
});
