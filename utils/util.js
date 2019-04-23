const { logger } = require('../config/chatroomConfig');

function logMessage(message) {
  logger.error(message);
}

module.exports = { logMessage };
