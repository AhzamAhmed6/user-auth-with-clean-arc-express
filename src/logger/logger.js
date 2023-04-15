export default function makeLogger({
  existsSync,
  mkdirSync,
  resolve,
  createLogger,
  format,
  transports,
}) {
  const customFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
      return `${info.timestamp} - [${info.level.padEnd(7).toUpperCase()}] - ${
        info.message
      }`;
    })
  );

  const logsDir = resolve("logs");
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir);
  }

  const logFileName = `${logsDir}/logger_${new Date()
    .toISOString()
    .slice(0, 10)}.log`;

  const fileTransport = new transports.File({
    filename: logFileName,
    level: "info",
    maxsize: 1024,
  });

  const logger = createLogger({
    format: customFormat,
    transports: [new transports.Console(), fileTransport],
  });
  return logger;
}
