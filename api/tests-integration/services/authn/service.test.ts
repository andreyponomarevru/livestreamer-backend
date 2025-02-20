import { describe, it, expect } from "@jest/globals";
import { authnService } from "../../../src/services/authn/index";

describe("authnService", () => {
  describe("confirmEmail", () => {
    it.todo("updates the user in db setting his email as 'confirmed'");
    it.todo("sends the welcome email");
  });

  describe("handlePasswordReset", () => {
    it.todo("saves the password reset token and the corresponding email");
    it.todo("sends the password-reset email");
  });

  describe("hashPassword", () => {
    it("checks password against password hash", async () => {
      const password = "*пар0ль-password($!";

      const passwordHash = await authnService.hashPassword(password);

      await expect(
        authnService.isPasswordMatch(password, passwordHash),
      ).resolves.toBe(true);
    });
  });

  describe("isPasswordMatch", () => {
    it.todo("returns true if the password matches its hashed version");
    it.todo("returns false if the passwords doesn't match its hashed version");

    it.todo("returns false if the error is thrown while comparing passwords");
    it.todo("doesn't throw if the password doesn't match its hashed versions");
  });

  describe("generateToken", () => {
    it.todo("generates and returns a new token");
  });
});
