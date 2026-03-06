const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { Quiz, QuizAttempt } = require('../models/Quiz');
const ApiError = require('../utils/ApiError');

exports.getQuizAttempts = async (req, res, next) => {
    try {
        const attempts = await QuizAttempt.find()
            .populate('student', 'name email')
            .populate('quiz', 'title passingScore')
            .sort('-createdAt')
            .limit(100);
        res.json({ success: true, data: attempts });
    } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const avgCompletion = await Enrollment.aggregate([
            { $group: { _id: null, avg: { $avg: '$completionPercent' } } }
        ]);
        const recentStudents = await User.find({ role: 'student' }).sort('-createdAt').limit(5).select('name email xp streak createdAt');
        const alerts = [];

        // Auto-generate alerts
        const at_risk = await Enrollment.find({ completionPercent: { $lt: 50 } }).populate('student', 'name email').populate('course', 'title').limit(10);
        at_risk.forEach(e => alerts.push({ type: 'warning', message: `${e.student?.name} is below 50% in ${e.course?.title}`, read: false }));

        res.json({
            success: true, data: {
                totalStudents, totalCourses, totalEnrollments,
                avgCompletion: avgCompletion[0]?.avg?.toFixed(1) || 0,
                recentStudents, alerts
            }
        });
    } catch (err) { next(err); }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const { search, sort } = req.query;
        const filter = { role: 'student' };
        if (search) filter.name = { $regex: search, $options: 'i' };
        let query = User.find(filter).select('-password');
        if (sort === 'xp') query = query.sort('-xp');
        else query = query.sort('-createdAt');
        const students = await query;

        const enriched = await Promise.all(students.map(async s => {
            const enrollments = await Enrollment.find({ student: s._id });
            const avgCompletion = enrollments.length
                ? Math.round(enrollments.reduce((a, e) => a + e.completionPercent, 0) / enrollments.length) : 0;
            const attempts = await QuizAttempt.find({ student: s._id });
            const avgScore = attempts.length
                ? Math.round(attempts.reduce((a, q) => a + q.score, 0) / attempts.length) : 0;
            return { ...s.toObject(), level: s.getLevel(), avgCompletion, avgScore, enrollmentCount: enrollments.length };
        }));

        res.json({ success: true, data: enriched });
    } catch (err) { next(err); }
};

exports.getStudentProfile = async (req, res, next) => {
    try {
        const student = await User.findById(req.params.id).select('-password');
        if (!student) throw new ApiError(404, 'Student not found');
        const enrollments = await Enrollment.find({ student: req.params.id }).populate('course', 'title');
        const attempts = await QuizAttempt.find({ student: req.params.id }).populate('quiz', 'title');
        res.json({ success: true, data: { ...student.toObject(), level: student.getLevel(), enrollments, attempts } });
    } catch (err) { next(err); }
};

exports.resetStudentProgress = async (req, res, next) => {
    try {
        await Enrollment.updateMany({ student: req.params.id }, { completedModules: [], completionPercent: 0 });
        await User.findByIdAndUpdate(req.params.id, { xp: 0, streak: 0 });
        res.json({ success: true, message: 'Student progress reset' });
    } catch (err) { next(err); }
};
