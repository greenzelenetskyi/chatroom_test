const router = require('express').Router();
const controller = require('../controllers/chatroom');
const { LIST_OPTION, FIND_SINGLE_OPTION } = require('../config/chatroomConfig');

// returns message list
router.get(`/list/:${LIST_OPTION}`, controller.validateListReqParam, controller.returnMessageList);

// returns single message by id
router.get(`/single/:${FIND_SINGLE_OPTION}`, controller.findMessage);

// saves single message to db
router.post('/', controller.validateSaveMessageRequest, controller.saveNewMessage);

exports.router = router;
