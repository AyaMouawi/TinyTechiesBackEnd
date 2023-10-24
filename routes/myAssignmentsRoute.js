const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    getAssignmentByCoursesAndStudentID, 
    addStudentAssignment,
    updateStudentAssignmentGradeByName,
    getGradesByCourseId,
    getAssignmentFile,
    
} = require('../controllers/myAssignmentsController');

router.get('/get/:cId/:sId', getAssignmentByCoursesAndStudentID);
router.get('/getAssignmentFile/:studentName/:assignmentName', getAssignmentFile);
router.get('/getGrade/:cId/:sId',  getGradesByCourseId);
router.post('/add',upload.fields([{ name: 'image' }, { name: 'file' }]), addStudentAssignment);
router.put('/update/:AssignmentName/:StudentName', updateStudentAssignmentGradeByName);

module.exports = router;