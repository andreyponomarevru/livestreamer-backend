process.env.NODE_ENV = "test"; // supress logging

import { describe, it, beforeEach, expect } from "@jest/globals";
import faker from "faker";

import { v4 as uuidv4 } from "uuid";

import { User } from "../../src/models/user/user";
import { Permissions } from "../../src/config/constants";
import { sanitizeUser } from "../../src/models/user/sanitize-user";

describe("sanitizeUser function", () => {
  const UUID = uuidv4();
  const ID = faker.datatype.number();
  const EMAIL = faker.internet.exampleEmail();
  const USERNAME = faker.internet.userName();
  const PASSWORD = faker.internet.password();
  const CREATED_AT = String(faker.date.past());
  const IS_EMAIL_CONFIRMED = faker.datatype.boolean();
  const IS_DELETED = faker.datatype.boolean();
  const PERMISSIONS = { broadcast: [faker.datatype.string()] } as Permissions;

  const user: User = {
    uuid: UUID,
    id: ID,
    email: EMAIL,
    username: USERNAME,
    password: PASSWORD,
    createdAt: CREATED_AT,
    isEmailConfirmed: IS_EMAIL_CONFIRMED,
    isDeleted: IS_DELETED,
    permissions: PERMISSIONS,
  };

  it("returns sanitized user", () => {
    expect(sanitizeUser(user)).toStrictEqual({
      uuid: UUID,
      id: ID,
      email: EMAIL,
      username: USERNAME,
      permissions: PERMISSIONS,
    });
  });
});
