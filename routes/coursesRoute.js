const express = require('express');
const router = express.Router();
const {
    getAllCourses, 
    getCourseByID, 
    addCourse, 
    deleteCourse, 
    updateCourse,
} = require('../controllers/coursesController');

router.get('/getAll', getAllCourses);
router.get('/get/:id', getCourseByID);
router.post('/add', addCourse);
router.delete('/delete/:id', deleteCourse);
router.put('/update/:id', updateCourse);


module.exports = router;