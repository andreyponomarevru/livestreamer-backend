import {
  MAIL_FROM_SERVICE,
  MAIL_FROM_HOST,
  MAIL_SERVICE_LOGIN,
  MAIL_SERVICE_PASSWORD,
  MAIL_FROM_PORT,
  SHOULD_LOG_TO_CONSOLE,
} from "../config/env";

export const mailConfig = {
  service: MAIL_FROM_SERVICE,
  host: MAIL_FROM_HOST,
  port: MAIL_FROM_PORT,
  secure: false,
  logger: SHOULD_LOG_TO_CONSOLE,
  debug: SHOULD_LOG_TO_CONSOLE,

  auth: { user: MAIL_SERVICE_LOGIN, pass: MAIL_SERVICE_PASSWORD },
};
