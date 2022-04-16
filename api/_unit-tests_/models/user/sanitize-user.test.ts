process.env.NODE_ENV = "test"; // supress logging

import { describe, it, beforeEach, expect } from "@jest/globals";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../../src/models/user/user";
import { Permissions } from "../../../src/config/constants";
import { sanitizeUser } from "../../../src/models/user/sanitize-user";

describe("sanitizeUser function", () => {
  const uuid = uuidv4();
  const id = faker.datatype.number();
  const email = faker.internet.exampleEmail();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const createdAt = faker.date.past().toISOString();
  const isEmailConfirmed = faker.datatype.boolean();
  const isDeleted = faker.datatype.boolean();
  const permissions = { broadcast: [faker.datatype.string()] } as Permissions;

  const user: User = {
    uuid,
    id,
    email,
    username,
    password,
    createdAt,
    isEmailConfirmed,
    isDeleted,
    permissions,
  };

  it("returns user with sensitive data stripped out", () => {
    expect(sanitizeUser(user)).toStrictEqual({
      uuid,
      id,
      email,
      username,
      permissions,
    });
  });
});
