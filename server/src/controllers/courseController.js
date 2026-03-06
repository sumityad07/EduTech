const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.getAllCourses = async (req, res, next) => {
    try {
        const { level, category, search } = req.query;
        // Admins see all courses (published + draft), students see published only
        const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
        if (level) filter.level = level;
        if (category) filter.category = category;
        if (search) filter.title = { $regex: search, $options: 'i' };
        const courses = await Course.find(filter).select('-modules.content').sort('-createdAt');
        res.json({ success: true, data: courses });
    } catch (err) { next(err); }
};

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) throw new ApiError(404, 'Course not found');
        res.json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
    try {
        const course = await Course.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) throw new ApiError(404, 'Course not found');
        res.json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) { next(err); }
};

exports.enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) throw new ApiError(404, 'Course not found');
        const exists = await Enrollment.findOne({ student: req.user._id, course: req.params.id });
        if (exists) throw new ApiError(400, 'Already enrolled');
        const enrollment = await Enrollment.create({ student: req.user._id, course: req.params.id });
        await Course.findByIdAndUpdate(req.params.id, { $inc: { enrolledCount: 1 } });
        await User.updateMany({ role: 'admin' }, { $push: { notifications: { message: `${req.user.name} enrolled in ${course.title}` } } });
        res.status(201).json({ success: true, data: enrollment });
    } catch (err) { next(err); }
};

exports.completeModule = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.params;
        const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
        if (!enrollment) throw new ApiError(404, 'Not enrolled');
        if (!enrollment.completedModules.map(String).includes(moduleId)) {
            enrollment.completedModules.push(moduleId);
            const course = await Course.findById(courseId);
            const total = course.modules.length;
            enrollment.completionPercent = Math.round((enrollment.completedModules.length / total) * 100);
            enrollment.lastAccessed = new Date();
            await enrollment.save();
            const mod = course.modules.id(moduleId);
            const xpGain = mod ? mod.xpReward : 20;
            await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpGain } });
        }
        res.json({ success: true, completionPercent: enrollment.completionPercent });
    } catch (err) { next(err); }
};

exports.getEnrolledCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
        res.json({ success: true, data: enrollments });
    } catch (err) { next(err); }
};

exports.toggleModuleLock = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.params;
        const { isLocked } = req.body;
        const course = await Course.findById(courseId);
        if (!course) throw new ApiError(404, 'Course not found');
        const mod = course.modules.id(moduleId);
        if (!mod) throw new ApiError(404, 'Module not found');
        mod.isLocked = isLocked;
        await course.save();
        res.json({ success: true, data: mod });
    } catch (err) { next(err); }
};
