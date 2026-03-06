const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { Quiz, QuizAttempt } = require('../models/Quiz');
const ApiError = require('../utils/ApiError');

exports.submitQuiz = async (req, res, next) => {
    try {
        const { quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) throw new ApiError(404, 'Quiz not found');

        let correct = 0;
        const results = quiz.questions.map((q) => {
            const ans = answers.find(a => String(a.questionId) === String(q._id));
            const isCorrect = ans && q.options[ans.selectedOption]?.isCorrect;
            if (isCorrect) correct++;
            return { questionId: q._id, selectedOption: ans?.selectedOption ?? -1, isCorrect, explanation: q.explanation };
        });

        const score = quiz.questions.length > 0 ? Math.round((correct / quiz.questions.length) * 100) : 0;
        const passed = score >= quiz.passingScore;

        const attempt = await QuizAttempt.create({ student: req.user._id, quiz: quizId, answers, score, passed });

        if (passed) {
            await User.findByIdAndUpdate(req.user._id, { $inc: { xp: quiz.xpReward } });
        }

        res.json({ success: true, data: { score, passed, correct, total: quiz.questions.length, xpEarned: passed ? quiz.xpReward : 0, attempt, results } });
    } catch (err) { next(err); }
};

exports.getQuizzesForCourse = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.json({ success: true, data: quizzes });
    } catch (err) { next(err); }
};

exports.getQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
        if (!quiz) throw new ApiError(404, 'Quiz not found');
        res.json({ success: true, data: quiz });
    } catch (err) { next(err); }
};

exports.getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find().populate('course', 'title').sort('-createdAt');
        res.json({ success: true, data: quizzes });
    } catch (err) { next(err); }
};

exports.getMyAttempts = async (req, res, next) => {
    try {
        const attempts = await QuizAttempt.find({ student: req.user._id })
            .populate('quiz', 'title passingScore xpReward course')
            .sort('-createdAt');
        res.json({ success: true, data: attempts });
    } catch (err) { next(err); }
};

exports.createQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    } catch (err) { next(err); }
};

exports.updateQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quiz) throw new ApiError(404, 'Quiz not found');
        res.json({ success: true, data: quiz });
    } catch (err) { next(err); }
};

exports.deleteQuiz = async (req, res, next) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Quiz deleted' });
    } catch (err) { next(err); }
};
