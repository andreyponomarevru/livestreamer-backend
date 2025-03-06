import { describe, it } from "@jest/globals";

describe("/broadcasts/:id/bookmark", () => {
  describe("POST - bookmark a broadcast", () => {
    describe("204", () => {
      it.todo("responds with an empty body, saving the bookmark");
    });

    describe("400", () => {
      it.todo("responds with an error if the path doesn't contain the user id");
      it.todo(
        "responds with an error if the body type if not 'application/x-www-form-urlencoded'",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("409", () => {
      it.todo(
        "responds with an error if the broadcast has already been bookmarked",
      );
    });
  });

  describe("DELETE - unbookmark the broadcast", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the bookmark has been successfuly deleted",
      );
    });

    describe("400", () => {
      it.todo("responds with an error if the path doesn't contain the user id");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("404", () => {
      it.todo(
        "responds with an error if the broadcast has never been bookrmarked",
      );
    });
  });
});
