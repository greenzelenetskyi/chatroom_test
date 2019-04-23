require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');
const { router } = require('./routes/chatroomRoutes');
const { logMessage } = require('./utils/util.js');
const { MESSAGES_ROUTE } = require('./config/chatroomConfig');

const app = express();
app.use(bodyParser.json());

// enable cors
app.use(cors({credentials: true, origin: true }));

app.use(compression());
app.use(helmet());

// messages api
app.use(MESSAGES_ROUTE, router);

// server starts only if db is available
(async function startService() {
  try {
    const dbClient = await MongoClient.connect(process.env.MONGODB_URI || process.env.DEV_MONGODB_URI, { useNewUrlParser: true });
    app.locals.db = dbClient.db(process.env.DB_NAME);
    app.listen(process.env.PORT || 8080, () => logMessage(`listens to port ${process.env.PORT}`));

    // close db connection on exit
    process.on('SIGINT', () => {
      dbClient.close();
      process.exit();
    });
  } catch (err) {
    logMessage(err.message);
  }
}());
