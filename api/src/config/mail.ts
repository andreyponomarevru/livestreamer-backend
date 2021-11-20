import {
  MAIL_FROM_SERVICE,
  MAIL_FROM_HOST,
  MAIL_SERVICE_LOGIN,
  MAIL_SERVICE_PASSWORD,
  NODE_ENV,
  MAIL_FROM_PORT,
} from "../config/env";

export const config = {
  service: MAIL_FROM_SERVICE,
  host: MAIL_FROM_HOST,
  port: MAIL_FROM_PORT,
  secure: NODE_ENV === "prod",
  logger: NODE_ENV === "dev",
  debug: NODE_ENV === "dev",

  auth: { user: MAIL_SERVICE_LOGIN, pass: MAIL_SERVICE_PASSWORD },
};
