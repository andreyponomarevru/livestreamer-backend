import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import setCookie from "set-cookie-parser";
import {
  broadcasterUser,
  listenerUser,
  superadminUser,
} from "../test-helpers/utils/user";
import { httpServer } from "../src/http-server";
import { RedisClient, redisConnection } from "../src/config/redis";
import { moreInfo } from "../test-helpers/constants";
import { signIn } from "../test-helpers/sign-in";

const sessionKeyPattern = "sess:*";
const sessionCookieResponse = [
  {
    name: "sess.sid",
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    value: expect.any(String),
    expires: expect.any(Date),
  },
];

let redisClient: RedisClient;
beforeAll(async () => {
  redisClient = await redisConnection.open();
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe(`/sessions (for the user with role Superadmin)`, () => {
  const superadminUserResponse = {
    results: {
      uuid: expect.any(String),
      id: 1,
      email: "system.andreyponomarev@yandex.ru",
      username: "hal",
      permissions: {
        all_user_accounts: ["read"],
        user_own_bookmarks: ["read", "delete", "create"],
        broadcast: ["delete", "update_partially"],
        broadcast_draft: ["update_partially", "read", "create", "delete"],
        scheduled_broadcast: ["create", "delete"],
        audio_stream: ["create"],
        any_chat_message: ["delete"],
      },
    },
  };

  describe("POST - sign in", () => {
    describe("signs in with credentials of the pre-seeded user", () => {
      it("signs in with username and password", async () => {
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
        expect(setCookie.parse(response.headers["set-cookie"])).toEqual(
          sessionCookieResponse,
        );

        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);
      });

      it("signs in with email and password", async () => {
        const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsBeforeSignIn.length).toBe(0);

        const response = await request(httpServer)
          .post("/sessions")
          .send({
            email: superadminUser.email,
            password: superadminUser.password,
          })
          .expect("content-type", /json/)
          .expect(200);
        expect(setCookie.parse(response.headers["set-cookie"])).toEqual(
          sessionCookieResponse,
        );
        expect(response.body).toEqual(superadminUserResponse);

        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);
      });
    });

    it("doesn't sign in if credentials are invalid", async () => {
      const response = await request(httpServer)
        .post("/sessions")
        .send({ username: "invalid", password: "invalid" })
        .expect("content-type", /json/)
        .expect(401);
      expect(response.body).toEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "Invalid email, username or password",
      });
    });

    it("doesn't sign in if the user is already signed in but attempts to sign in again", async () => {
      const firstSignInResponse = await signIn(superadminUser);
      const sessionCookie = setCookie.parse(
        firstSignInResponse.headers["set-cookie"][0],
      )[0];

      const secondSignInResponse = await request(httpServer)
        .post("/sessions")
        .set("cookie", `${sessionCookie.name}=${sessionCookie.value}`)
        .send({
          username: superadminUser.username,
          password: superadminUser.password,
        })
        .expect("content-type", /json/)
        .expect(401);
      expect(secondSignInResponse.body).toEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "Can't authenticate the request, no cookie found",
      });
    });

    it("doesn't sign in if credentials are malformed", async () => {
      const response = await request(httpServer)
        .post("/sessions")
        .send({ user: superadminUser.username, pass: superadminUser.password })
        .expect("content-type", /json/)
        .expect(400);
      expect(response.body).toEqual({
        ...moreInfo,
        status: 400,
        statusText: "BadRequest",
        message: "Invalid email, username or password",
      });
    });
  });

  describe("DELETE - sign out", () => {
    it("signs out if the user is currently signed in", async () => {
      const signInResponse = await signIn(superadminUser);
      const sessionCookie = setCookie.parse(
        signInResponse.headers["set-cookie"],
      )[0];

      const sessionKeyPattern = "sess:*";
      const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignIn.length).toBe(1);

      await request(httpServer)
        .delete("/sessions")
        .set("Cookie", `${sessionCookie.name}=${sessionCookie.value}`)
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
      expect(response.body).toEqual({
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
      expect(response.body).toEqual({
        ...moreInfo,
        status: 401,
        statusText: "Unauthorized",
        message: "You must authenticate to access this resource",
      });
    });
  });
});

describe(`/sessions (for the user with role Listener)`, () => {
  const listenerUserResponse = {
    results: {
      uuid: expect.any(String),
      id: 3,
      email: "esplendidoes@yandex.ru",
      username: "johndoe",
      permissions: {
        user_own_account: [
          "create",
          "read",
          "update",
          "delete",
          "update_partially",
        ],
        user_own_bookmarks: ["create", "read", "delete"],
        broadcast: ["read"],
        user_own_chat_message: ["delete", "read"],
      },
    },
  };

  describe("signs in with credentials of the pre-seeded user", () => {
    it("signs in with username and password", async () => {
      const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsBeforeSignIn.length).toBe(0);

      const response = await request(httpServer)
        .post("/sessions")
        .send({
          username: listenerUser.username,
          password: listenerUser.password,
        })
        .expect("content-type", /json/)
        .expect(200);
      expect(setCookie.parse(response.headers["set-cookie"])).toEqual(
        sessionCookieResponse,
      );
      expect(response.body).toEqual(listenerUserResponse);

      const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignIn.length).toBe(1);
    });
  });
});

describe(`/sessions (for the user with role Broadcaster)`, () => {
  const broadcasterUserResponse = {
    results: {
      uuid: expect.any(String),
      id: 2,
      email: "info@andreyponomarev.ru",
      username: "andreyponomarev",
      permissions: { audio_stream: ["create"] },
    },
  };

  describe("signs in with credentials of the pre-seeded user", () => {
    it("signs in with username and password", async () => {
      const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsBeforeSignIn.length).toBe(0);

      const response = await request(httpServer)
        .post("/sessions")
        .send({
          username: broadcasterUser.username,
          password: broadcasterUser.password,
        })
        .expect("content-type", /json/)
        .expect(200);
      expect(setCookie.parse(response.headers["set-cookie"])).toEqual(
        sessionCookieResponse,
      );

      expect(response.body).toEqual(broadcasterUserResponse);

      const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
      expect(sessionsAfterSignIn.length).toBe(1);
    });
  });
});
