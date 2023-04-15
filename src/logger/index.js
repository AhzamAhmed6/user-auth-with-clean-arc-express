import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { createLogger, format, transports } from "winston";
import makeLogger from "./logger.js";

const logger = makeLogger({
  existsSync,
  mkdirSync,
  resolve,
  createLogger,
  format,
  transports,
});

const myLogger = Object.freeze({
  error: (error) => logger.error(error),
  info: (info) => logger.info(info),
});

export default myLogger;
