const { findMessageById, collectMessageListPortion, recordNewMessage } = require('../models/charoomModel');
const {
  LIST_OPTION,
  FIND_SINGLE_OPTION,
  DB_COLLECTION,
  MESSAGES_ROUTE,
} = require('../config/chatroomConfig');
const {
  isValidId,
  isValidBodyStructure,
  isValidFormat,
} = require('./validation');

// response codes
const NOT_FOUND_CODE = 404;
const BAD_REQUEST_CODE = 400;
const INTERNAL_ERR_CODE = 500;
const CREATED_CODE = 201;

// err names
const BAD_REQUEST_ERR = 'Bad Request';
const NOT_FOUND_ERR = 'Resource not found';
const INTERNAL_ERR = 'Internal Server Error';

// err messages
const NOT_AVAILABLE_RESOURCE = 'The specified resource not found.';
const SERVER_FAIL_MESSAGE = 'The server could not fullfil your request.';

// basic email validation (for common email formats)
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.:]?\w+)*(\.[a-zA-Z0-9]{2,3})+$/;

// message text can be multiline string, 1 to 100 chars long
const MESSAGE_REGEX = /^[\s\S]{1,100}$/;

// exclude non-digit chars
const INT_REGEX = /[^\D]/;

// per page
const MESSAGE_LIST_SIZE = 10;
const NEW_MESSAGE_PATTERN = {
  email: 'string',
  message: 'string',
};

// in response
const createErrorObject = (error, message) => ({ error, message });

// in response
const createMessageObject = ({
  email,
  message,
  creationTime,
  updateTime,
}) => ({
  email, message, creationTime, updateTime,
});

// return a message data by its id
async function findMessage(req, res, next) {
  try {
    const result = await findMessageById(req.app.locals.db.collection(DB_COLLECTION), req.params[FIND_SINGLE_OPTION]);
    if (result === null) {
      return res.status(NOT_FOUND_CODE).json(createErrorObject(NOT_FOUND_ERR, NOT_AVAILABLE_RESOURCE));
    }
    res.json(createMessageObject(result));
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).json(createErrorObject(INTERNAL_ERR, SERVER_FAIL_MESSAGE));
    next(err);
  }
}

// the page number is specified by consumer, number of entries per page are predefined here
async function returnMessageList(req, res, next) {
  try {
    const result = await collectMessageListPortion(req.app.locals.db.collection(DB_COLLECTION), req.params[LIST_OPTION], MESSAGE_LIST_SIZE);
    if (result.length === 0) {
      return res.status(NOT_FOUND_CODE).json(createErrorObject(NOT_FOUND_ERR, NOT_AVAILABLE_RESOURCE));
    }
    res.json(result.map(entry => createMessageObject(entry)));
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).json(createErrorObject(INTERNAL_ERR, SERVER_FAIL_MESSAGE));
    next(err);
  }
}

// reqest body and required props are validated by middleware
async function saveNewMessage(req, res, next) {
  try {
    const result = await recordNewMessage(req.app.locals.db.collection(DB_COLLECTION), req.body.email, req.body.message);
    if (result.insertedCount > 1) {
      return res.status(INTERNAL_ERR_CODE).json(createErrorObject(INTERNAL_ERR, SERVER_FAIL_MESSAGE));
    }
    // path to the message saved
    res.set('Location', `${MESSAGES_ROUTE}/single/${result.insertedId}`);
    res.status(CREATED_CODE).json({ message: 'Message saved successfully' });
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).json(createErrorObject(INTERNAL_ERR, SERVER_FAIL_MESSAGE));
    next(err);
  }
}

// POST /api/messages/ validation middleware
function validateSaveMessageRequest(req, res, next) {
  if (!isValidBodyStructure(req.body, NEW_MESSAGE_PATTERN) || !isValidFormat(EMAIL_REGEX, req.body.email) || !isValidFormat(MESSAGE_REGEX, req.body.message)) {
    return res.status(BAD_REQUEST_CODE).json(createErrorObject(BAD_REQUEST_ERR, 'Invalid request format.'));
  }
  next();
}

// GET /api/messages/list/ param validation middleware
function validateListReqParam(req, res, next) {
  if (!isValidFormat(INT_REGEX, req.params[LIST_OPTION])) {
    return res.status(BAD_REQUEST_CODE).json(createErrorObject(BAD_REQUEST_ERR, `Invalid ${LIST_OPTION} parameter`));
  }
  next();
}

// GET /api/messages/single/ param validation middleware
function validateMessageIdParam(req, res, next) {
  if (!isValidId(req.params[FIND_SINGLE_OPTION])) {
    return res.status(BAD_REQUEST_CODE).json(createErrorObject(BAD_REQUEST_ERR, `Invalid ${FIND_SINGLE_OPTION} parameter`));
  }
  next();
}

module.exports = {
  findMessage,
  returnMessageList,
  saveNewMessage,
  validateSaveMessageRequest,
  validateListReqParam,
  validateMessageIdParam,
};
