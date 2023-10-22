const express = require('express');
const router = express.Router();
const {
    getCounts
} = require('../controllers/statisticsController');

router.get('/getCount', getCounts);



module.exports = router;