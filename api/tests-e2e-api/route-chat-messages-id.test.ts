import { describe, it } from "@jest/globals";

describe("/chat/messages/:id", () => {
  describe("DELETE - delete chat message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the message has been successfuly deleted",
      );

      it.todo(
        "allows the user with the role 'Listener' role delete only their own comments",
      );

      it.todo("allows the user with the 'superadmin' role delete any comment");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the chat message :id",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user with the 'Listener' role attempts to delete someone else's message",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if chat message doesn't exist");
    });
  });
});
