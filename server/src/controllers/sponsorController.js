const User = require('../models/User');
const Sponsorship = require('../models/Sponsorship');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');

exports.getSponsorDashboard = async (req, res, next) => {
    try {
        const sponsorships = await Sponsorship.find({ sponsor: req.user._id, isActive: true }).populate('student', 'name email xp streak');
        const totalFunded = sponsorships.reduce((a, s) => a + s.amount, 0);
        const completed = sponsorships.filter(s => {
            // check enrollments
            return true; // simplified
        }).length;
        const costPerSuccess = completed > 0 ? (totalFunded / completed).toFixed(2) : 0;

        const studentIds = sponsorships.map(s => s.student._id);
        const enrollments = await Enrollment.find({ student: { $in: studentIds } });

        const enriched = await Promise.all(sponsorships.map(async sp => {
            const studentEnrollments = enrollments.filter(e => String(e.student) === String(sp.student._id));
            const avgCompletion = studentEnrollments.length
                ? Math.round(studentEnrollments.reduce((a, e) => a + e.completionPercent, 0) / studentEnrollments.length) : 0;
            const risk = avgCompletion < 30 ? 'High' : avgCompletion < 50 ? 'Medium' : avgCompletion < 60 ? 'Low' : 'None';
            return { ...sp.toObject(), student: { ...sp.student.toObject(), avgCompletion, risk } };
        }));

        res.json({ success: true, data: { sponsorships: enriched, totalFunded, totalStudents: sponsorships.length, costPerSuccess } });
    } catch (err) { next(err); }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const { search, atRisk } = req.query;
        const filter = { role: 'student' };
        if (search) filter.name = { $regex: search, $options: 'i' };
        const students = await User.find(filter).select('-password');
        const enriched = await Promise.all(students.map(async s => {
            const enrollments = await Enrollment.find({ student: s._id });
            const avgCompletion = enrollments.length ? Math.round(enrollments.reduce((a, e) => a + e.completionPercent, 0) / enrollments.length) : 0;
            const isAtRisk = avgCompletion < 50 || s.streak < 3;
            const risk = avgCompletion < 30 ? 'High' : avgCompletion < 50 ? 'Medium' : avgCompletion < 60 ? 'Low' : 'None';
            return { ...s.toObject(), level: s.getLevel(), avgCompletion, isAtRisk, risk };
        }));

        const result = atRisk === 'true' ? enriched.filter(s => s.isAtRisk) : enriched;
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
};

exports.sponsorStudent = async (req, res, next) => {
    try {
        const { studentId, amount, notes } = req.body;
        const student = await User.findById(studentId);
        if (!student) throw new ApiError(404, 'Student not found');
        const sponsorship = await Sponsorship.create({ sponsor: req.user._id, student: studentId, amount, notes });
        res.status(201).json({ success: true, data: sponsorship });
    } catch (err) { next(err); }
};
