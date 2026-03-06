const express = require('express');
const router = express.Router();
const { getSponsorDashboard, getAllStudents, sponsorStudent } = require('../controllers/sponsorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/dashboard', protect, authorize('sponsor'), getSponsorDashboard);
router.get('/students', protect, authorize('sponsor'), getAllStudents);
router.post('/sponsor', protect, authorize('sponsor'), sponsorStudent);

module.exports = router;
