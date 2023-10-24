const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    addAssignmentContent,
    getAssignmentByCourseName
} = require('../controllers/assignmentContentController');

router.post('/add',upload.single('file'), addAssignmentContent);
router.get('/getAssignmentByCourse/:Cname', getAssignmentByCourseName);



module.exports = router;