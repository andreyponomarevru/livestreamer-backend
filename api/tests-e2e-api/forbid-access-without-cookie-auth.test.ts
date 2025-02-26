import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { httpServer } from "../src/http-server";
import { response401 } from "../test-helpers/responses";
import { superadminUser } from "../test-helpers/jest-hooks/utils/user";

const ROUTES = {
  GET: ["/users", "/broadcasts/drafts"],
  POST: [
    "/schedule",
    "/chat/messages",
    "/chat/messages/1/like",
    "/broadcasts/1/bookmark",
  ],
  PUT: ["/stream", "/stream/like"],
  PATCH: ["/user", "/broadcasts/1", "/broadcasts/drafts/1"],
  DELETE: [
    "/user",
    "/schedule/1",
    "/moderation/chat/messages/1",
    "/chat/messages/1",
    "/chat/messages/1/like",
    "/broadcasts/1",
    "/broadcasts/1/bookmark",
    "/broadcasts/drafts/1",
  ],
};

describe("responds with a 401 error if the user is not authenticated", () => {
  it.each(ROUTES.GET)("GET %p", async (route: string) => {
    const response = await request(httpServer)
      .get(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.POST)("POST %p", async (route: string) => {
    const response = await request(httpServer)
      .post(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.PUT)("PUT %p", async (route: string) => {
    const response = await request(httpServer)
      .put(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.DELETE)("DELETE %p", async (route: string) => {
    const response = await request(httpServer)
      .delete(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.PATCH)("PATCH %p", async (route: string) => {
    const response = await request(httpServer)
      .patch(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });
});

describe("responds with a 401 if the header doesn't contain the session cookie", () => {
  it.each(ROUTES.GET)("GET %p", async (route: string) => {
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .send({
        username: superadminUser.username,
        password: superadminUser.password,
      })
      .expect(200);

    const response = await request(httpServer)
      .get(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.POST)("POST %p", async (route: string) => {
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .send({
        username: superadminUser.username,
        password: superadminUser.password,
      })
      .expect(200);

    const response = await request(httpServer)
      .post(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.PUT)("PUT %p", async (route: string) => {
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .send({
        username: superadminUser.username,
        password: superadminUser.password,
      })
      .expect(200);

    const response = await request(httpServer)
      .put(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.DELETE)("DELETE %p", async (route: string) => {
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .send({
        username: superadminUser.username,
        password: superadminUser.password,
      })
      .expect(200);

    const response = await request(httpServer)
      .delete(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });

  it.each(ROUTES.PATCH)("PATCH %p", async (route: string) => {
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .send({
        username: superadminUser.username,
        password: superadminUser.password,
      })
      .expect(200);

    const response = await request(httpServer)
      .patch(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(response401);
  });
});
