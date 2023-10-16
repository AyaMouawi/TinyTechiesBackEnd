require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
require('./config/db');

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });