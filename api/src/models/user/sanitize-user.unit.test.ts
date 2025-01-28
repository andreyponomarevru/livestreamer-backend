import { describe, it, beforeEach, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user";
import { Permissions } from "../../config/constants";
import { sanitizeUser } from "./sanitize-user";

describe("sanitizeUser function", () => {
  const uuid = uuidv4();
  const id = faker.number.int();
  const email = faker.internet.exampleEmail();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const createdAt = faker.date.past().toISOString();
  const isEmailConfirmed = faker.datatype.boolean();
  const isDeleted = faker.datatype.boolean();
  const permissions = { broadcast: [faker.string.sample()] } as Permissions;

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
