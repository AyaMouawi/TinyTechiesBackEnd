const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    addAssignmentContent,
} = require('../controllers/assignmentContentController');

router.post('/add',upload.single('file'), addAssignmentContent);




module.exports = router;