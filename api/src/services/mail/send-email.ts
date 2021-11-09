import nodemailer, { SendMailOptions } from "nodemailer";

import { config } from "../../config/mail";
import { logger } from "../../config/logger";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { NODE_ENV } from "../../config/env";

async function sendEmail(
  mailOptions: SendMailOptions,
): Promise<SMTPTransport.SentMessageInfo> {
  logger.debug(mailOptions);

  const transporter = nodemailer.createTransport(config);
  const info = await transporter.sendMail(mailOptions);

  logger.debug("Message sent: ", info.messageId);

  return info;
}

export { sendEmail };
export {
  createConfirmationEmail,
  createWelcomeEmail,
  createResetPasswordEmail,
} from "./email-templates";
