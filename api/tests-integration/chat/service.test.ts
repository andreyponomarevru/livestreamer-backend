import { describe, it } from "@jest/globals";

describe("chatService", () => {
  describe("createMsg", () => {
    it.todo("saves the message");
    it.todo(
      "emits the 'create_message' event if the message has been successfuly saved",
    );
    it.todo("returns the saved message");
  });

  describe("destroyMsg", () => {
    it.todo("delete the message");
    it.todo(
      "emits the 'delete_message' event if the message has been successfully deleted",
    );
  });

  describe("readMsgsPaginated", () => {
    it.todo("returns the messages paginated");
  });

  describe("likeMsg", () => {
    it.todo("saves the like");
    it.todo(
      "emits the 'like_message' event if the like has been saved successfuly",
    );
  });

  describe("unlikeMsg", () => {
    it.todo("deletes the like");
    it.todo(
      "emits the 'unlike_message' event if the like has been deleted successfully",
    );
  });
});
