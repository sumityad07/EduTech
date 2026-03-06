const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllStudents, getStudentProfile, resetStudentProgress, getQuizAttempts } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/students/:id', protect, authorize('admin'), getStudentProfile);
router.put('/students/:id/reset', protect, authorize('admin'), resetStudentProgress);
router.get('/quiz-attempts', protect, authorize('admin'), getQuizAttempts);

module.exports = router;
