const env = {
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,

  // HTTP Server
  HTTP_PORT: Number(process.env.HTTP_PORT),
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  SAVED_STREAMS_DIR: process.env.SAVED_STREAMS_DIR,

  // Database Server
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,

  // Logger
  LOG_LOCATION: process.env.LOG_LOCATION,
  ERROR_LOG_NAME: process.env.ERROR_LOG_NAME,
  INFO_LOG_NAME: process.env.INFO_LOG_NAME,
  DEBUG_LOG_NAME: process.env.DEBUG_LOG_NAME,
};

export { env };
