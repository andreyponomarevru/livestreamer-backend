import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { superadminUser } from "../test-helpers/utils/user";
import { httpServer } from "../src/http-server";
import { RedisClient, redisConnection } from "../src/config/redis";
import { moreInfo } from "../test-helpers/constants";
import { signIn } from "../test-helpers/sign-in";

const sessionKeyPattern = "sess:*";

let redisClient: RedisClient;

describe(`Sign In and Sign Out the user ${superadminUser.username}`, () => {
  beforeAll(async () => {
    redisClient = await redisConnection.open();
    httpServer.listen();
  });

  afterAll(() => {
    httpServer.close((err) => {
      if (err) throw err;
    });
  });

  describe("POST", () => {
    it("signs in with credentials of the pre-seeded user", async () => {
      const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsBeforeSignIn.length).toBe(0);

      const response = await request(httpServer)
        .post("/sessions")
        .send({
          username: superadminUser.username,
          password: superadminUser.password,
        })
        .expect("content-type", /json/)
        .expect(200);

      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toEqual(expect.stringMatching(/sess.sid=/));

      const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignIn.length).toBe(1);
    });

    it("doesn't sign in if credentials are invalid", async () => {
      const response = await request(httpServer)
        .post("/sessions")
        .send({ username: "invalid", password: "invalid" })
        .expect("content-type", /json/)
        .expect(401);

      expect(response.body).toStrictEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "Invalid email, username or password",
      });
    });

    it("doesn't sign in if the user is already signed in but attempts to sign in again", async () => {
      const response = await signIn(superadminUser);
      const cookie = response.headers["set-cookie"][0];

      await request(httpServer)
        .post("/sessions")
        .set("Cookie", [cookie as string])
        .send({
          username: superadminUser.username,
          password: superadminUser.password,
        })
        .expect("content-type", /json/)
        .expect(401);
    });

    it("doesn't sign in if credentials are malformed", async () => {
      const response = await request(httpServer)
        .post("/sessions")
        .send({ user: superadminUser.username, pass: superadminUser.password })
        .expect("content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        ...moreInfo,
        status: 400,
        statusText: "BadRequest",
        message: "Invalid email, username or password",
      });
    });
  });

  describe("DELETE", () => {
    it("signs out if the user is currently signed in", async () => {
      const response = await signIn(superadminUser);
      const cookie = response.headers["set-cookie"][0];

      const sessionKeyPattern = "sess:*";
      const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignIn.length).toBe(1);

      await request(httpServer)
        .delete("/sessions")
        .set("Cookie", [cookie as string])
        .expect(204);
      const sessionsAfterSignOut = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignOut.length).toBe(0);
    });

    it("doesn't sign out if the user is not signed in", async () => {
      const response = await request(httpServer)
        .delete("/sessions")
        .send({
          username: superadminUser.username,
          password: superadminUser.password,
        })
        .expect("content-type", /json/)
        .expect(401);

      expect(response.body).toStrictEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "You must authenticate to access this resource",
      });
    });

    it("doesn't sign out if credentials are invalid", async () => {
      const response = await request(httpServer)
        .delete("/sessions")
        .send({ username: "invalid", password: "invalid" })
        .expect("content-type", /json/)
        .expect(401);

      expect(response.body).toStrictEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "You must authenticate to access this resource",
      });
    });
  });
});
