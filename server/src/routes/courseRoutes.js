const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, completeModule, getEnrolledCourses, toggleModuleLock } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/', protect, getAllCourses);
router.get('/enrolled', protect, getEnrolledCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.post('/:courseId/modules/:moduleId/complete', protect, authorize('student'), completeModule);
router.put('/:courseId/modules/:moduleId/lock', protect, authorize('admin'), toggleModuleLock);

module.exports = router;
