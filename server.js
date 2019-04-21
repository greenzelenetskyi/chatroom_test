require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const chatroomEndpoints = require('./routes/chatroomRoutes');
const { logMessage } = require('./utils/util.js');

const app = express();
const MESSAGES_ROUTE = '/api/messages';

(async function connectDb() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true });
  app.locals.db = client.db();
}());

app.use(bodyParser.json());
app.use(MESSAGES_ROUTE, chatroomEndpoints.router);

app.listen(process.env.PORT || 8080, () => logMessage(`listens to port ${process.env.PORT}`));
