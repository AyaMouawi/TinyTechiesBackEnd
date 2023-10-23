const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllTrainers, 
  getTrainerByID,
  getTrainersFullName, 
  getTrainerCourses,
  getTrainerCoursesName,
  deleteTrainer,
  addTrainer,
} = require('../controllers/trainersController');

router.get('/getAllTrainers', getAllTrainers);
router.get('/getTrainerByID/:id', getTrainerByID);
router.get('/getTrainersFullName', getTrainersFullName);
router.get('/getTrainerCourses/:id', getTrainerCourses);
router.get('/getTrainerCoursesName/:id', getTrainerCoursesName);
router.post('/add', upload.single('image'), addTrainer);
router.delete('/delete/:id', deleteTrainer)



module.exports = router;