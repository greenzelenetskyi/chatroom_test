require('dotenv').config();
const express = require('express');

const app = express();

app.listen(process.env.PORT || 8080, () => console.log(`listens to port ${process.env.PORT}`));
