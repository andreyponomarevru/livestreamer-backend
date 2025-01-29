import {
  // jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import request from "supertest";

import { httpServer } from "../src/http-server";

describe("Broadcast", () => {
  beforeEach(async () => {
    httpServer.listen();
  });

  afterEach(() => {
    httpServer.close((err) => {
      if (err) throw err;
    });
  });

  describe("GET /broadcasts", () => {
    it("returns json response containing all published broadcasts", async () => {
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
});
