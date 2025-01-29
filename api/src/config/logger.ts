import {
  APP_NAME,
  LOG_LOCATION,
  DEBUG_LOG_NAME,
  //INFO_LOG_NAME,
  // ERROR_LOG_NAME,
  SHOULD_LOG_TO_CONSOLE,
  SHOULD_LOG_TO_FILE,
} from "./../config/env";

//
// Winston logger
//

// TIP: Winston Logging Levels:
// 0: error, 1: warn, 2: info, 3: verbose, 4: debug, 5: silly

import winston from "winston";
const {
  createLogger,
  format: { combine, timestamp, label, colorize, printf },
  transports,
} = winston;

const logFormat = printf(({ level, message, /*label,*/ timestamp }) => {
  return `${level} [${timestamp}] ${"" /*label.toUpperCase()*/}: ${message}`;
});

// Write all logs with level 'debug' and below to file
// TIP: to write logs to console isntead of file, remove "filename" key below and replace `transport.File` with `transport.Console`
const debugConsoleTransport = new transports.Console({
  level: "debug",
  format: combine(
    label({ label: APP_NAME }),
    timestamp(),
    colorize({ all: true }),
    logFormat,
  ),
  silent: !SHOULD_LOG_TO_CONSOLE,
});

const debugFileTransport = new transports.File({
  level: "debug",
  filename: `${LOG_LOCATION}/${DEBUG_LOG_NAME}`,
  format: combine(
    label({ label: APP_NAME }),
    timestamp(),
    colorize({ all: true }),
    logFormat,
  ),
  silent: !SHOULD_LOG_TO_FILE,
});
/*
// Write all logs with level 'info' and below to INFO_LOG_NAME
const infoFileTransport = new transports.File({
  level: "info",
  filename: `${LOG_LOCATION}/${INFO_LOG_NAME}`,
  maxsize: 5242880, // 5MB
  maxFiles: 2,
  format: combine(label({ label: APP_NAME }), timestamp(), logFormat),
  silent: SHOULD_LOG_TO_FILE,
});

// Write all logs with level 'error' and below to file
const errorFileTransport = new transports.File({
  level: "error",
  filename: `${LOG_LOCATION}/${ERROR_LOG_NAME}`,
  maxsize: 5242880, // 5MB
  maxFiles: 2,
  format: combine(label({ label: APP_NAME }), timestamp(), logFormat),
});*/

function createTransports(shouldLogToConsole = true, shouldLogToFile = true) {
  const transports = [];
  if (shouldLogToConsole) transports.push(debugConsoleTransport);
  if (shouldLogToFile) transports.push(debugFileTransport);
  return transports;
}

const logger = createLogger({
  transports: createTransports(SHOULD_LOG_TO_CONSOLE, SHOULD_LOG_TO_FILE),
  exitOnError: false, // do not exit on uncaughtException
});

// Put Morgan logs inside Winston logs,
// Create a stream object that will be used by Morgan. Later we will use this
// function to get morgan-generated output into the winston log files
const stream = {
  write: (message: string): void => {
    // use the 'info' log level. The output will be picked up by both
    // transports (file and console)
    logger.info(message);
  },
  silent: true,
};

//
// Morgan logger
//

// Redirect Morgan logging to Winston log files
const morganSettings = { immediate: true, stream };

export { logger, morganSettings };
