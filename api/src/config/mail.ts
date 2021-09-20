import {
  MAIL_FROM_SERVICE,
  MAIL_FROM_HOST,
  SENDINBLUE_LOGIN,
  SENDINBLUE_PASSWORD,
  NODE_ENV,
  MAIL_FROM_PORT,
} from "../config/env";

export const config = {
  service: MAIL_FROM_SERVICE,
  host: MAIL_FROM_HOST,
  port: MAIL_FROM_PORT,
  //secure: true,
  logger: NODE_ENV === "development" ? true : false,
  debug: NODE_ENV === "development" ? true : false,

  auth: {
    user: SENDINBLUE_LOGIN,
    pass: SENDINBLUE_PASSWORD,
  },
};
