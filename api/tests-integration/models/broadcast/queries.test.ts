import { describe, it } from "@jest/globals";

describe("broadcastRepo", () => {
  describe("create", () => {
    it.todo("creates a new broadcast");
    it.todo("returns a new broadcast");
  });

  describe("read", () => {
    it.todo("returns the broadcast by id");
  });

  describe("readAll", () => {
    it.todo("returns all broadcasts");
  });

  describe("update", () => {
    it.todo("updates the broadcast");
  });

  describe("destroy", () => {
    it.todo("destroys the broadcast");
  });

  describe("readLikesCount", () => {
    it.todo("returns the likes count");
  });

  describe("bookmark", () => {
    describe("if the broadcast is publicly visible", () => {
      it.todo("creates a new bookmark for the given broadcast");
    });

    describe("if the broadcast is hidden", () => {
      it.todo("doesn't create a bookmark");
    });
  });

  describe("readAllBookmarked", () => {
    it.todo("returns all bookmarked broadcasts");
  });

  describe("unbookmark", () => {
    it.todo("deletes the bookmark for the given broadcast");
  });
});
