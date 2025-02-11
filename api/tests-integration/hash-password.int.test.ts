import { describe, it, expect } from "@jest/globals";
import { authnService } from "../src/services/authn/index";

describe("Password hashing", () => {
  it("checks password against password hash", async () => {
    const password = "*пар0ль-password($!";

    const passwordHash = await authnService.hashPassword(password);

    await expect(
      authnService.isPasswordMatch(password, passwordHash),
    ).resolves.toBe(true);
  });
});
