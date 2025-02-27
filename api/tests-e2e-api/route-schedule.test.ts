import { describe, it } from "@jest/globals";

describe("/schedule", () => {
  describe("GET - get all scheduled broadcasts", () => {
    describe("200", () => {
      it.todo("responds with all scheduled broadcasts");
    });
  });

  describe("POST  - schedules a new broadcast", () => {
    describe("201", () => {
      it.todo("responds with the scheduled broadcast");
    });

    describe("400", () => {
      it.todo("responds with an error if the request body is malformed");
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

  describe("DELETE - remove the scheduled broadcast", () => {
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
});
