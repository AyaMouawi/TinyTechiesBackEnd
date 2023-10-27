const express = require('express');
const router = express.Router();

const {
    getStudentsByCourseName,
    Enroll, 
    getAllStudents,
    getAllStudentsAndCourses,
    
} = require('../controllers/studentController');

router.get('/getByCourseName/:CourseName', getStudentsByCourseName);
router.get('/getAllStudents', getAllStudents);
router.get('/getAllStudentsAndCourses', getAllStudentsAndCourses);
router.post('/Enroll', Enroll)

module.exports = router;