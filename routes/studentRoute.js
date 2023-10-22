const express = require('express');
const router = express.Router();

const {
    getStudentsByCourseName,
    Enroll, 
    
} = require('../controllers/studentController');

router.get('/getByCourseName/:CourseName', getStudentsByCourseName);
router.post('/Enroll', Enroll)

module.exports = router;