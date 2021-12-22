import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";

import { httpServer } from "../src/http-server";
import { testuser } from "./helpers/seeds/users.seed";

describe("GET /user", () => {
  let adminCookie: string | undefined;

  beforeEach(async () => {
    httpServer.listen();
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .set("content-type", "application/json")
      .send({ username: testuser.username, password: testuser.password })
      .then((res) => (adminCookie = res.headers["set-cookie"][0]))
      .catch(console.error);
  });

  afterEach(() => {
    httpServer.close((err) => {
      if (err) throw err;
    });
    adminCookie = undefined;
  });

  it("returns json containing authenticated user info", async () => {
    await request(httpServer)
      .get("/user")
      .set("accept", "application/json")
      .set("Cookie", [adminCookie as string])
      .set("content-type", "application/json")
      .expect("content-type", /application\/json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual({
          results: {
            username: expect.any(String),
            email: expect.any(String),
            id: expect.any(Number),
            uuid: expect.any(String),
            permissions: expect.any(Object),
          },
        });
      })
      .catch(console.error);
  });

  it("returns 401 if user is not authenticated", async () => {
    await request(httpServer)
      .get("/user")
      .set("accept", "application/json")
      .set("content-type", "application/json")
      .expect("content-type", /application\/json/)
      .expect(401)
      .then((res) => {
        expect(res.body).toStrictEqual({
          message: expect.any(String),
          moreInfo: expect.any(String),
          status: 401,
          statusText: expect.any(String),
        });
      });
  });

  it("returns 401 on invalid cookie", async () => {
    await request(httpServer)
      .get("/user")
      .set("accept", "application/json")
      .set("content-type", "application/json")
      .set("Cookie", [("fakecookie" + adminCookie) as string])
      .expect("content-type", /application\/json/)
      .expect(401)
      .then((res) => {
        expect(res.body).toStrictEqual({
          message: expect.any(String),
          moreInfo: expect.any(String),
          status: 401,
          statusText: expect.any(String),
        });
      });
  });
});
