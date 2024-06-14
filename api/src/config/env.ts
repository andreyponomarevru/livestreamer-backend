//
// App Initialization
//

export const APP_NAME = process.env.APP_NAME!;
export const NODE_ENV = process.env.NODE_ENV!;

//
// HTTP Server
//

export const HTTP_PORT = Number(process.env.HTTP_PORT);

//
// WebSocket Server
//

export const WS_SERVER_URL = process.env.WS_SERVER_URL!;

//
// Postgres
//

export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;
export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_DB = process.env.POSTGRES_DB!;
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);

//
// Redis
//

export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_HOST = process.env.REDIS_HOST!;

//
// Logger
//

export const LOG_LOCATION = process.env.LOG_LOCATION!;
export const ERROR_LOG_NAME = process.env.ERROR_LOG_NAME!;
export const INFO_LOG_NAME = process.env.INFO_LOG_NAME!;
export const DEBUG_LOG_NAME = process.env.DEBUG_LOG_NAME!;

//
// Mail service
//

export const MAIL_FROM_HOST = process.env.MAIL_FROM_HOST!;
export const MAIL_FROM_SERVICE = process.env.MAIL_FROM_SERVICE!;
export const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL!;
export const MAIL_SERVICE_LOGIN = process.env.MAIL_SERVICE_LOGIN!;
export const MAIL_SERVICE_PASSWORD = process.env.MAIL_SERVICE_PASSWORD!;
export const MAIL_FROM_PORT = Number(process.env.MAIL_FROM_PORT)!;

export const EMAIL_CONFIRMATION_LINK = process.env.EMAIL_CONFIRMATION_LINK!;
export const SIGN_IN_LINK = process.env.SIGN_IN_LINK!;
export const SUBMIT_NEW_PASSWORD_LINK = process.env.SUBMIT_NEW_PASSWORD_LINK!;

//
// Authentication
//

export const AUTH_COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET!;
export const COOKIE_NAME = process.env.COOKIE_NAME!;
export const REDIS_COOKIE_EXPIRATION_TTL = Number(
  process.env.REDIS_COOKIE_EXPIRATION_TTL,
);
export const EXPRESS_SESSION_COOKIE_MAXAGE = Number(
  process.env.EXPRESS_SESSION_COOKIE_MAXAGE,
);
