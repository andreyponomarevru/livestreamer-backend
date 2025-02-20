import { describe, it } from "@jest/globals";

describe("DELETE /moderation/chat/messages/:id - delete chat message", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body if the message has been deleted successfuly",
    );
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the request parameter doesn't contain the :id",
    );
    it.todo(
      "responds with an error if the request query path doesn't contain the :user_id",
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
});
