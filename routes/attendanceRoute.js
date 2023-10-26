const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    addAttendance,
} = require('../controllers/attendanceController');

router.post('/add', addAttendance);




module.exports = router;