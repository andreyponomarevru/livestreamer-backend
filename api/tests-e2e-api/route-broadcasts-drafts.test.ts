import { describe, it } from "@jest/globals";

describe("/broadcasts/drafts", () => {
  describe("GET - get all broadcast drafts", () => {
    describe("200", () => {
      it.todo("responds with all existing broadcast drafts");
    });
  });

  describe("PATCH /broadcasts/drafts/:id - update a broadcast draft", () => {
    describe("204", () => {
      it.todo("responds with an empty body if updated successfuly");
    });
  });

  describe("DELETE /broadcasts/drafts/:id - delete a broadcast draft", () => {
    describe("204", () => {
      it.todo("responds with an empty body if updated successfuly");
    });
  });
});
