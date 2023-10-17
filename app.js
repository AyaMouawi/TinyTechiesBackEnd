require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
require('./config/db');
const userRoutes = require('./routes/userRoute'); // change according to the route of your table example : const projectRoutes = require('./routes/projectRoute')

app.use(bodyParser.json());
app.use('/user', userRoutes); // change according to the routes of your table example : app.use('/projects', projectRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });