import { describe, it, beforeAll, afterAll } from "@jest/globals";
import { httpServer } from "../src/http-server";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe("GET /users", () => {
  describe("200", () => {
    it.todo("responds with an array of all users (not paginated)");

    it.todo(
      "responds with the sanitized user objects (they don't contain any sensitive data)",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo("responds with an error if the user role has no permissions");
  });
});
