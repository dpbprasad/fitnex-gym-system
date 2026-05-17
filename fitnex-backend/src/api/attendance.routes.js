const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendanceController');

router.get('/attendance/qr-token', AttendanceController.getQRToken);
router.post('/attendance/validate', AttendanceController.validateQR);

module.exports = router;
