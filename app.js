// app.js
const express = require('express');
const { port } = require('./config/config');
const logger = require('./config/logger');

const app = express();
const PORT = port;

require('./routes')(app);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
