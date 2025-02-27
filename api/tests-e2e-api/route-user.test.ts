import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";
import { createUser } from "../test-helpers/create-user";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe("/user", () => {
  const maxUsernameLength = 16;
  const maxPasswordLength = 50;
  const username = faker.internet.username().substring(0, maxUsernameLength);
  const password = faker.internet.password().substring(0, maxPasswordLength);
  const email = faker.internet.email();

  describe(`POST - create a new user account`, () => {
    describe("202", () => {
      it("accepts the request for processing, responding with an empty body", async () => {
        await request(httpServer)
          .post("/user")
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email })
          .expect(202);
      });

      it("saves a new user in database", async () => {
        await request(httpServer)
          .post("/user")
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email });

        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT * FROM appuser WHERE username = '${username}'`,
        );
        expect(dbResponse.rows).toStrictEqual([
          {
            appuser_id: expect.any(Number),
            role_id: 2,
            username,
            email,
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
      it("responds with an error if the username and password are not provided in the 'Authorization' header, using the 'Basic' schema", async () => {
        await request(httpServer)
          .post("/user")
          .set("authorization", "Basic ")
          .send({ email })
          .expect(400);
      });
    });

    describe("409", () => {
      it("responds with an error if the user with this username or email already exists", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: false,
        });

        await request(httpServer)
          .post("/user")
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email })
          .expect(409);
      });
    });
  });

  describe(`DELETE - delete user account`, () => {
    describe("204", () => {
      it("allows the user with role 'listener' to delete his own account", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
        });
        const agent = request.agent(httpServer);
        await agent
          .post("/sessions")
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);

        await agent.delete("/user").expect(204);
      });
    });
  });

  describe(`GET - get user account`, () => {
    describe("200", () => {
      it("responds with a user object", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
        });
        const agent = request.agent(httpServer);
        await agent
          .post("/sessions")
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);

        const response = await agent.get("/user").expect(200);
        expect(response.body).toStrictEqual({
          results: {
            email,
            username,
            id: expect.any(Number),
            uuid: expect.any(String),
            permissions: {
              broadcast: ["read"],
              user_own_account: [
                "create",
                "read",
                "update",
                "delete",
                "update_partially",
              ],
              user_own_bookmarks: ["create", "read", "delete"],
              user_own_chat_message: ["delete", "read"],
            },
          },
        });
      });
    });
  });

  describe(`PATCH - update user account`, () => {
    describe("200", () => {
      it("responds with an updated user object", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
        });
        const agent = request.agent(httpServer);
        await agent
          .post("/sessions")
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);
        const newUsername = faker.internet.username();

        const response = await agent
          .patch("/user")
          .send({ username: newUsername })
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            email,
            username: newUsername,
            id: expect.any(Number),
            uuid: expect.any(String),
            permissions: {
              broadcast: ["read"],
              user_own_account: [
                "create",
                "read",
                "update",
                "delete",
                "update_partially",
              ],
              user_own_bookmarks: ["create", "read", "delete"],
              user_own_chat_message: ["delete", "read"],
            },
          },
        });
      });
    });

    describe("409", () => {
      it("responds with an error if the user with the submited username already exists", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
        });
        const user2 = {
          username: faker.internet.username(),
          password: faker.internet.password(),
        };
        await createUser({
          ...user2,
          email: faker.internet.email(),
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
        });
        const agent = request.agent(httpServer);
        await agent
          .post("/sessions")
          .set("accept", "application/json")
          .send({ username: user2.username, password: user2.password })
          .expect(200);

        const response = await agent
          .patch("/user")
          .send({ username })
          .expect(409);

        expect(response.body).toStrictEqual({
          message: "Sorry, this username is already taken",
          moreInfo: "https://github.com/ponomarevandrey/",
          status: 409,
          statusText: "Conflict",
        });
      });
    });
  });
});
