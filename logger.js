const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Özel log formatı tanımlayın
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Logger'ı oluşturun
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console({ level: 'info' }) // Konsola da yazmak isterseniz
  ]
});

module.exports = logger;
