import { describe, it } from "@jest/globals";

describe("GET /schedule", () => {
  describe("200", () => {
    it.todo("responds with all scheduled broadcasts");
  });
});

describe("POST /schedule - schedules a new broadcast", () => {
  describe("201", () => {
    it.todo("responds with the scheduled broadcast");
  });

  describe("400", () => {
    it.todo("responds with an error if the request body is malformed");
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user doesn't have the required permissions",
    );
  });

  describe("409", () => {
    it.todo(
      "responds with an error if there is already a scheduled broadcast in this time range",
    );
  });
});

describe("DELETE /schedule", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body if the scheduled broadcast has been deleted successfuly",
    );
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the scheduled broadcast id hasn't been passed in the path",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user doesn't have the required permissions",
    );
  });

  describe("404", () => {
    it.todo(
      "responds with an error if the provided broadcast id doesn't exist",
    );
  });
});
