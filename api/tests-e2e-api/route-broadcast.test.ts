import { describe, it } from "@jest/globals";

describe("/broadcasts", () => {
  describe("GET /broadcasts - get all published broadcasts", () => {
    describe("200", () => {
      it.todo("responds with a list of all broadcasts");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });
  });

  describe("DELETE /broadcasts/:id - delete a broadcast", () => {
    describe("204", () => {
      it.todo("responds with an empty body if deleted successfuly");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request doesn't contain the broadcast :id in the path",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the broadcast doesn't exist");
    });
  });

  describe("PATCH /broadcasts/:id - update a broadcast", () => {
    describe("200", () => {
      it.todo("responds with an updated broadcast");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the broadcast :id is not provided in the path",
      );
      it.todo("responds with an error if the request doesn't contain a body");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the broadcast doesn't exist");
    });
  });
});

describe("/broadcasts/:id/bookmark", () => {
  describe("POST /broadcasts/:id/bookmark - bookmark a broadcast", () => {
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

  describe("DELETE /broadcasts/:id/bookmark - delete broadcast bookmark", () => {
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

describe("/broadcasts/drafts", () => {
  describe("GET /broadcasts/drafts - get all broadcast drafts", () => {});

  describe("PATCH /broadcasts/drafts/:id - update a broadcast draft", () => {});

  describe("DELETE /broadcasts/drafts/:id - delete a broadcast draft", () => {});
});
