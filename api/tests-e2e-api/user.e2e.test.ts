import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";

const username = "ivanivanovich";
const password = "12345678";
const email = "ivan@ivanovich.ru";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe("/user", () => {
  describe("POST - create a new user account with role Listener", () => {
    it("creates a new user account", async () => {
      await request(httpServer)
        .post("/user")
        .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
        .send({ email })
        .expect(202);

      const pool = await dbConnection.open();
      const dbResponse = await pool.query(
        `SELECT * FROM appuser WHERE username = '${username}'`,
      );

      expect(dbResponse.rows).toEqual([
        {
          appuser_id: expect.any(Number),
          role_id: 2,
          username: "ivanivanovich",
          email: "ivan@ivanovich.ru",
          created_at: expect.any(Date),
          password_hash: expect.any(String),
          last_login_at: null,
          is_deleted: false,
          is_email_confirmed: false,
          email_confirmation_token: expect.any(String),
          password_reset_token: null,
        },
      ]);
    });
  });

  it.todo("doesn't sign in if the user account is unconfirmed");
  it.todo("signs in if the user account has been confirmed");
});
