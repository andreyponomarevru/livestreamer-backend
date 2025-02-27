import { describe, it, beforeAll, afterAll } from "@jest/globals";
// import request from "supertest";
import { httpServer } from "../src/http-server";
// import { dbConnection } from "../src/config/postgres";
// import { superadminUser } from "../test-helpers/jest-hooks/utils/user";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe("/user/settings/password", () => {
  describe(`PATCH - update the pasword`, () => {
    describe("202", () => {
      /*it("responds with an empty body", async () => {
        await request(httpServer).patch("/user/settings/password").send({
          email: superadminUser.email,
        });
      });*/

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
