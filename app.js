require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
require('./config/db');
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoute');
const coursesRoutes = require('./routes/coursesRoute');


app.use('/user', userRoutes);
app.use('/courses', coursesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });