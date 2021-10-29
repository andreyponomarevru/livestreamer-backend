import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";

import { testuser } from "./helpers/seeds/users.seed";
import { httpServer } from "../src/http-server";
import { newBroadcast } from "./helpers/seeds/broadcasts.seed";

describe("Schedule Broadcast", () => {
  let adminCookie: string | undefined;
  let newBroadcastId: number;

  beforeAll(async () => {
    httpServer.listen();
    await request(httpServer)
      .post("/sessions")
      .set("accept", "application/json")
      .set("content-type", "application/json")
      .send({ username: testuser.username, password: testuser.password })
      .then((res) => (adminCookie = res.headers["set-cookie"][0]));
  });

  afterAll(async () => {
    await request(httpServer)
      .delete("/sessions")
      .set("accept", "application/json")
      .set("content-type", "application/json")
      .set("Cookie", [adminCookie as string]);

    httpServer.close((err) => {
      if (err) throw err;
    });
  });

  describe("POST /schedule", () => {
    it("creates a new scheduled broadcast", async () => {
      await request(httpServer)
        .post("/schedule")
        .set("accept", "application/json")
        .set("content-type", "application/json")
        .set("Cookie", [adminCookie as string])
        .send(newBroadcast)
        .expect(200)
        .expect("content-type", /application\/json/)
        .then((res) => {
          expect(res.body).toStrictEqual({
            results: { id: expect.any(Number), ...newBroadcast },
          });
          newBroadcastId = res.body.results.id;
          return res;
        });
    });
  });

  describe("GET /schedule", () => {
    it("returns a json response containing all scheduled broadcasts", async () => {
      await request(httpServer)
        .get("/broadcasts")
        .set("accept", "application/json")
        .expect("content-type", /application\/json/)
        .expect(200)
        .then((res) => {
          expect(res.body).toStrictEqual({ results: expect.any(Array) });
        });
    });
  });

  describe("DELETE /schedule/:id", () => {
    it("deletes scheduled broadcast", async () => {
      await request(httpServer)
        .delete(`/schedule/${newBroadcastId}`)
        .set("Cookie", [adminCookie as string])
        .set("accept", "application/json")
        .expect(204);
    });
  });
});
