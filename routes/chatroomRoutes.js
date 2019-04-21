const router = require('express').Router();
const { findMessage, returnMessageList, saveNewMessage } = require('../controllers/chatroom');

const BASE_ROUTE = '/';
const LIST_ROUTE = `${BASE_ROUTE}list/:pageId`;
const SINGLE_ROUTE = `${BASE_ROUTE}single/:messageId`;

router.get(LIST_ROUTE, returnMessageList);

router.get(SINGLE_ROUTE, findMessage);

router.post(BASE_ROUTE, saveNewMessage);

exports.router = router;
