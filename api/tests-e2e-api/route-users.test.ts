import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { httpServer } from "../src/http-server";
import {
  listenerUser,
  superadminUser,
  broadcasterUser,
} from "../test-helpers/jest-hooks/utils/user";
import { response403 } from "../test-helpers/responses";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe("/users", () => {
  describe("GET", () => {
    describe("200", () => {
      it("responds with an array of all users (not paginated) if the user role is 'superadmin'", async () => {
        const agent = request.agent(httpServer);
        await agent.post("/sessions").set("accept", "application/json").send({
          username: superadminUser.username,
          password: superadminUser.password,
        });
        const user = {
          uuid: expect.any(String),
          id: expect.any(Number),
          email: expect.any(String),
          username: expect.any(String),
          password: expect.any(String),
          createdAt: expect.any(String),
          isEmailConfirmed: true,
          isDeleted: false,
          permissions: expect.any(Array),
        };
        const expected = { results: [user, user, user] };

        const response = await agent.get("/users");

        expect(response.body).toMatchObject(expected);
      });

      it.todo(
        "responds with the sanitized user objects (they don't contain any sensitive data) if the user role is 'superadmin'",
      );
    });

    describe("403", () => {
      it("responds with an error if the user role is 'Listener'", async () => {
        const agent = request.agent(httpServer);
        await agent.post("/sessions").set("accept", "application/json").send({
          username: listenerUser.username,
          password: listenerUser.password,
        });

        const response = await agent
          .get("/users")
          .expect(403)
          .expect("content-type", /json/);

        expect(response.body).toStrictEqual(response403);
      });

      it("responds with an error if the user role is 'Broadcaster'", async () => {
        const agent = request.agent(httpServer);
        await agent.post("/sessions").set("accept", "application/json").send({
          username: broadcasterUser.username,
          password: broadcasterUser.password,
        });

        const response = await agent
          .get("/users")
          .expect(403)
          .expect("content-type", /json/);

        expect(response.body).toStrictEqual(response403);
      });
    });
  });
});
