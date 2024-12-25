const express = require('express');
const upload = require('../middleware/multer');
const AttendaceController = require('../controller/attendanceController')
const authVerify = require('../middleware/auth')
const router = express.Router();

router.post('/submit', authVerify.checkAuthorization, upload.single('file'), AttendaceController.submitAttendance);
router.post('/getUserAttendance', authVerify.checkAuthorization, AttendaceController.submitAttendance);

module.exports = router;

