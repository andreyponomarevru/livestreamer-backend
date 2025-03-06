import { describe, it } from "@jest/globals";

describe("/broadcasts", () => {
  describe("GET - get all published broadcasts", () => {
    describe("200", () => {
      it("responds with a list of all broadcasts", () => {});
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });
  });
});
