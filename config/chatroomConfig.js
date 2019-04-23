const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/log.log' }),
  ],
});

/*
  shared constants
*/

// page number
const LIST_OPTION = 'pageId';

// db id string
const FIND_SINGLE_OPTION = 'messageId';

const DB_COLLECTION = 'messages';

// base route for all operations with messages
const MESSAGES_ROUTE = '/api/messages';

module.exports = {
  LIST_OPTION,
  FIND_SINGLE_OPTION,
  DB_COLLECTION,
  MESSAGES_ROUTE,
  logger,
};
