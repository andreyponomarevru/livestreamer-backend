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
  const API_ROUTE = "/user";

  describe(`POST ${API_ROUTE} - create a new user account`, () => {
    describe("202", () => {
      it("responds with a new user object", async () => {
        await request(httpServer)
          .post(API_ROUTE)
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email })
          .expect(202);

        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT * FROM appuser WHERE username = '${username}'`,
        );

        expect(dbResponse.rows).toStrictEqual([
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

    describe("400", () => {
      it.todo(
        "responds with an error if the username and password are not provided in the 'Authorization' header, using the 'Basic' schema",
      );
    });

    describe("409", () => {
      it.todo(
        "responds with an error if the user with this username or email already exists",
      );
    });
  });

  describe(`DELETE ${API_ROUTE} - delete user account`, () => {
    describe("204", () => {
      it.todo(
        "allows the user with role 'superadmin' to delete others accounts",
      );
      it.todo("allows the user with role 'listener' to delete his own account");
      it.todo(
        "responds with an empty body if the account has been deleted successfuly",
      );
    });

    describe("400", () => {
      it.todo("responds with an error if the request is malformed");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user with role 'listener' attempts to delete someone else's account",
      );

      it.todo(
        "responds with an error if the user with role 'broadcaster' attempts to delete someone else's account",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the user has already been deleted");

      it.todo(
        "responds with an error if the user sign up email hasn't been confirmed yet",
      );
    });
  });

  describe(`GET ${API_ROUTE} - get user account`, () => {
    describe("200", () => {
      it.todo("responds with a user object");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request doesn't container the user id in the path",
      );
    });

    describe("403", () => {
      it.todo("responds with an error if the user has no permissions");
    });

    describe("404", () => {
      it.todo("responds with an error if the requested user doesn't exist");
    });
  });

  describe(`PATCH ${API_ROUTE} - update user account (only username)`, () => {
    describe("200", () => {
      it.todo("responds with an updated user object");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request doesn't container the user id in the path",
      );
    });

    describe("403", () => {
      it.todo("responds with an error if the user role has no permissions");
    });

    describe("404", () => {
      it.todo("responds with an error if the requested user doesn't exist");
    });

    describe("409", () => {
      it.todo(
        "responds with an error if the user with this username or email already exists",
      );
    });
  });
});

describe("/user/settings/password", () => {
  const API_ROUTE = "/user/settings/password";

  describe(`PATCH ${API_ROUTE} - update the pasword`, () => {
    describe("202", () => {
      it.todo(
        "responds with an empty body and sends the password reset (aka password update) token (i.e. the link with a password reset token) to the user's email if the user sends the request containing only email",
      );

      it.todo(
        "responds with an empty body and saves the new password if the user sends the request containing the previously provided password reset token (the one he got on email) + a new password",
      );
    });

    describe("204", () => {
      it.todo(
        "responds with an empty body if a new password has been saved  successfuly",
      );
    });

    describe("400", () => {
      describe("if the request is to get the new password reset token", () => {
        it.todo(
          "responds with an error if the body doesn't contain the user email used during the sign up",
        );
        it.todo(
          "responds with an error if the email provided in the body has not been confirmed",
        );
      });

      describe("if the request is to save the new password", () => {
        it.todo(
          "responds with an error if the body doesn't contain both the previously obtained password reset token and a new password",
        );
      });
    });

    describe("401", () => {
      it.todo(
        "responds with an error if the user supplies an invalid password reset token",
      );
      it.todo(
        "responds with an error if the user doesn't send the password reset token",
      );
    });
  });
});
