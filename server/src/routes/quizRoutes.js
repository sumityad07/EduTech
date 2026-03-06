const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizzesForCourse, getQuiz, getAllQuizzes, getMyAttempts, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/my-attempts', protect, getMyAttempts);
router.get('/all', protect, authorize('admin'), getAllQuizzes);
router.get('/course/:courseId', protect, getQuizzesForCourse);
router.get('/:id', protect, getQuiz);
router.post('/submit', protect, submitQuiz);
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

module.exports = router;
