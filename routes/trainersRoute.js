const express = require('express');
const router = express.Router();
const {
  getAllTrainers, 
  getTrainerByID,
  getTrainersFullName, 
  getTrainerCourses,
  getTrainerCoursesName,
} = require('../controllers/trainersController');

router.get('/getAllTrainers', getAllTrainers);
router.get('/getTrainerByID/:id', getTrainerByID);
router.get('/getTrainersFullName', getTrainersFullName);
router.get('/getTrainerCourses/:id', getTrainerCourses);
router.get('/getTrainerCoursesName/:id', getTrainerCoursesName);



module.exports = router;