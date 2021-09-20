export const APP_NAME = process.env.APP_NAME!;
export const NODE_ENV = process.env.NODE_ENV!;

// HTTP Server
export const HTTP_PORT = Number(process.env.HTTP_PORT);
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
export const SAVED_STREAMS_DIR = process.env.SAVED_STREAMS_DIR!;

// WebSocket Server
export const WS_SERVER_URL = process.env.WS_SERVER_URL!;

// Database Server
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;
export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE!;

// Logger
export const LOG_LOCATION = process.env.LOG_LOCATION!;
export const ERROR_LOG_NAME = process.env.ERROR_LOG_NAME!;
export const INFO_LOG_NAME = process.env.INFO_LOG_NAME!;
export const DEBUG_LOG_NAME = process.env.DEBUG_LOG_NAME!;

// Auth
export const MAIL_FROM_HOST = process.env.MAIL_FROM_HOST!;
export const MAIL_FROM_SERVICE = process.env.MAIL_FROM_SERVICE!;
export const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL!;
export const SENDINBLUE_LOGIN = process.env.SENDINBLUE_LOGIN!;
export const SENDINBLUE_PASSWORD = process.env.SENDINBLUE_PASSWORD!;
export const MAIL_FROM_PORT = Number(process.env.MAIL_FROM_PORT)!;
