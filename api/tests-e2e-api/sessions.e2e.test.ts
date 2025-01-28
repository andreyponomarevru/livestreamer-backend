import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { testuser } from "../test-helpers/seeds/users.seed";
import { httpServer } from "../src/http-server";

// TODO add test cases for invalid cerdentials

describe("Sign In and Sign Out", () => {
  let adminCookie: string | undefined;

  beforeAll(() => {
    httpServer.listen();
  });

  afterAll(() => {
    httpServer.close((err) => {
      if (err) throw err;
    });
  });

  describe("POST /sessions", () => {
    it("signs in when credentials are valid", async () => {
      await request(httpServer)
        .post("/sessions")
        .set("accept", "application/json")
        .set("content-type", "application/json")
        .send({ username: testuser.username, password: testuser.password })
        .expect("content-type", /application\/json/)
        .expect(200)
        .then((res) => {
          adminCookie = res.headers["set-cookie"][0];
          expect(adminCookie).toEqual(expect.stringMatching(/sess.sid=/));
        });

      // TODO Add - right here - sending request to database to retrieve the inserted data and compare it with the one that was send in request body by client
    });

    it("return 401 when credentials are invalid", async () => {
      await request(httpServer)
        .post("/sessions")
        .set("accept", "application/json")
        .set("content-type", "application/json")
        .send({
          username: testuser.username,
          password: testuser.password + ".",
        })
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

    // TODO Split this test into two separate
    it("return 401 when the user has been already authenticated and sends the seconds request with valid credentials but without session cookie attached", async () => {
      await request(httpServer)
        .post("/sessions")
        .set("accept", "application/json")
        .set("content-type", "application/json")
        .send({
          username: testuser.username,
          password: testuser.password + ".",
        })
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

  describe("DELETE /sessions", () => {
    it("signs out when the user is currently signed in", async () => {
      await request(httpServer)
        .delete("/sessions")
        .set("Cookie", [adminCookie as string])
        .expect(204);

      // TODO check database to make sure the record was deleted
    });

    it("returns 200 when the user is not signed in", async () => {
      await request(httpServer).delete("/sessions").expect(401);
    });
  });
});
