export const APP_NAME = process.env.APP_NAME;
export const NODE_ENV = process.env.NODE_ENV;

// HTTP Server
export const HTTP_PORT = Number(process.env.HTTP_PORT);
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
export const SAVED_STREAMS_DIR = process.env.SAVED_STREAMS_DIR;

// WebSocket Servers
export const STREAMING_SERVER_NAME = process.env.STREAMING_SERVER_NAME;
export const INFO_SERVER_NAME = process.env.INFO_SERVER_NAME;

// Database Server
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;

// Logger
export const LOG_LOCATION = process.env.LOG_LOCATION;
export const ERROR_LOG_NAME = process.env.ERROR_LOG_NAME;
export const INFO_LOG_NAME = process.env.INFO_LOG_NAME;
export const DEBUG_LOG_NAME = process.env.DEBUG_LOG_NAME;
