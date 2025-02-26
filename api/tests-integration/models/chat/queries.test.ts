import { describe, it } from "@jest/globals";

describe("chatRepo", () => {
  describe("createMsg", () => {
    it.todo("saves the message");
    it.todo("returns the saved message");
  });

  describe("destroyMsg", () => {
    it.todo("deletes the message");
    it.todo(
      "doen't return anything if the user tries to delete nonexistent message",
    );
  });

  // Better refactor the code, moving the cursor-creation feature into the separate function and remove some of the tests below
  describe("readMsgsPaginated", () => {
    it.todo("returns messages accordng to the cursor");

    describe("if there are no messages", () => {
      it.todo("sets the next cursor to null");
      it.todo("returns an empty array of messages");
    });

    describe("if there is no next page of messages", () => {
      it.todo("sets the next cursor to null");
      it.todo("returns an array containing the remaining messages");
    });

    describe("if two or more messages have the same timestamp", () => {
      it.todo("returns a composite cursor");
    });
  });

  describe("createMsgLike", () => {
    it.todo("saves the message like");
    it.todo("returns the created message like");
  });

  describe("destroyMsgLike", () => {
    it.todo("deletes the message like");
    it.todo(
      "doesn't return anything if the user tries to delete the like of nonexistent message",
    );
  });
});
