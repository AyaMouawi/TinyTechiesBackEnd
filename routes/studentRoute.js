const express = require('express');
const router = express.Router();

const {
    getStudentsByCourseName,
    Enroll, 
    getAllStudents,
    
} = require('../controllers/studentController');

router.get('/getByCourseName/:CourseName', getStudentsByCourseName);
router.get('/getAllStudents', getAllStudents);
router.post('/Enroll', Enroll)

module.exports = router;