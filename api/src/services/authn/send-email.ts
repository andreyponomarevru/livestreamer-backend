import nodemailer, { SendMailOptions } from "nodemailer";

import { config } from "../../config/mail";
import { logger } from "../../config/logger";

export async function sendEmail(mailOptions: SendMailOptions) {
  logger.debug(mailOptions);

  const transporter = nodemailer.createTransport(config);
  const info = await transporter.sendMail(mailOptions);

  logger.debug("Message sent: ", info.messageId);

  return info;
}
