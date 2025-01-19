process.env.NODE_ENV = "test"; // supress logging

import { jest, describe, it, expect } from "@jest/globals";

import { readUser } from "../../../src/models/user/queries";
import { connectDB, close } from "../../../src/config/postgres";

describe("readUser", () => {
  it("returns a user if user id exists", async () => {
    // console.log(await readUser(1));
    //expect(readUser(1)).toStrictEqual();
  });
});
