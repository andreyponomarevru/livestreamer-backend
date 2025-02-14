import {
  APP_NAME,
  LOG_LOCATION,
  DEBUG_LOG_NAME,
  // INFO_LOG_NAME,
  // ERROR_LOG_NAME,
  SHOULD_LOG_TO_CONSOLE,
  SHOULD_LOG_TO_FILE,
} from "./../config/env";

//
// Winston logger
//

import winston from "winston";
const {
  createLogger,
  format: { combine, timestamp, label, colorize, printf },
  transports,
} = winston;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${level} [${timestamp}] ${String(label).toUpperCase()}: ${message}`;
});

const debugConsoleTransport = new transports.Console({
  // Affect all logs with level 'debug' and below
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

function createTransports(shouldLogToConsole = true, shouldLogToFile = true) {
  const transports = [];
  if (shouldLogToConsole) transports.push(debugConsoleTransport);
  if (shouldLogToFile) transports.push(debugFileTransport);
  return transports;
}

const logger = createLogger({
  transports: createTransports(SHOULD_LOG_TO_CONSOLE, SHOULD_LOG_TO_FILE),
  exitOnError: false,
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
