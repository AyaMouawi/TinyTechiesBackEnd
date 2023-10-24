const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    getAllCourses, 
    getCourseByID, 
    addCourse, 
    deleteCourse, 
    updateCourse,
    getPopularCourses,
    getStudentCourse,
    getCoursesByTrainerID,
    getCourseByCourseName,
    getCoursesByStudentId,
    getCourseIDByName,
} = require('../controllers/coursesController');

router.get('/getAll', getAllCourses);
router.get('/getCourseName/:CourseName', getCourseIDByName);

router.get('/get/:id', getCourseByID);
router.get('/getByStudent/:id',getCoursesByStudentId);
router.get('/getByName/:id', getCourseByCourseName);
router.get('/getCoursesByTrainerId/:id', getCoursesByTrainerID);
router.get('/getStudentCourse/:id', getStudentCourse);
router.post('/add',upload.fields([{ name: 'image' }, { name: 'file' }]), addCourse);
router.delete('/delete/:id', deleteCourse);
router.put('/update/:id',upload.fields([{ name: 'image' }, { name: 'file' }]), updateCourse);
router.get('/getPopular', getPopularCourses);

module.exports = router;