import crypto from "crypto";
import bcrypt from "bcrypt";
import util from "util";
import { userRepo } from "../../models/user/queries";
import { logger } from "../../config/logger";
import { mailService } from "../mail";

export const authnService = {
  confirmEmail: async function (userId: number): Promise<void> {
    const { username, email } = await userRepo.confirmEmail(userId);
    const welcomeEmail = mailService.emailTemplates.createWelcomeEmail({
      username,
      email,
    });
    logger.debug(welcomeEmail);

    await mailService.sendEmail(welcomeEmail);
  },

  handlePasswordReset: async function (email: string): Promise<void> {
    const token = this.generateToken();
    await userRepo.savePasswordResetToken({ email, token });
    const passwordResetEmail =
      mailService.emailTemplates.createPasswordResetEmail({ email, token });
    logger.debug(`${__filename}: ${util.inspect(passwordResetEmail)}`);

    await mailService.sendEmail(passwordResetEmail);
  },

  hashPassword: async function (
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  },

  isPasswordMatch: async function (
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      logger.error(`${__filename}: ${err}`);
      return false;
    }
  },

  generateToken: function (size = 64): string {
    return crypto.randomBytes(size).toString("hex");
  },
};
