const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    addPresenceAttendance  ,
    addAbsentAttendance,
} = require('../controllers/attendanceController');

router.post('/addPresence', addPresenceAttendance  );
router.post('/addAbsent', addAbsentAttendance  );




module.exports = router;