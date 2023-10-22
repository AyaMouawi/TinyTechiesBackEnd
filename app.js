require('dotenv').config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');

// Initialize firebase app
initializeApp(firebaseConfig);
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
require('./config/db');
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/userRoute');
const coursesRoutes = require('./routes/coursesRoute');
const statisticsRoutes = require('./routes/statisticsRoute');
const trainersRoutes = require('./routes/trainersRoute');
const projectsRoutes = require('./routes/projectsRoute');
const myAssignmentRoutes = require('./routes/myAssignmentsRoute');
const assignmentContentRoutes = require('./routes/assignmentContentRoute');
const studentRoutes = require('./routes/studentRoute');

app.use('/user', userRoutes);
app.use('/courses', coursesRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/trainers', trainersRoutes);
app.use('/projects', projectsRoutes);
app.use('/myAssignments', myAssignmentRoutes);
app.use('/assignmentContent', assignmentContentRoutes);
app.use('/student', studentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });