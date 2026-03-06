const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({ text: String, isCorrect: Boolean });
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema],
    explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    moduleId: { type: mongoose.Schema.Types.ObjectId },
    questions: [questionSchema],
    passingScore: { type: Number, default: 70 },
    xpReward: { type: Number, default: 50 },
    timeLimit: { type: Number, default: 30 }, // minutes
}, { timestamps: true });

const quizAttemptSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedOption: Number }],
    score: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    attemptedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
module.exports = { Quiz, QuizAttempt };
