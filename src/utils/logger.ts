import winston, { createLogger, format } from "winston";
const { combine, timestamp, json, errors, prettyPrint, colorize, printf } =
  format;

const consoleFormatter = combine(
  colorize(),
  printf(({ level, message, timestamp }) => {
    return `${level}:${message}`;
  })
);
const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), json(), prettyPrint(), errors({ stack: true })),
  transports: [
    new winston.transports.Console({ format: consoleFormatter }),
    new winston.transports.File({ filename: "app.log", level: "warn" }),
  ],
});
export default logger;
