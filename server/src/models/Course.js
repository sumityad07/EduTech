const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'text', 'project', 'quiz'], default: 'video' },
    videoUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // minutes
    order: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    xpReward: { type: Number, default: 20 },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: 'General' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
    duration: { type: Number, default: 0 },
    instructor: { type: String, default: 'VisiN1000 Team' },
    isPublished: { type: Boolean, default: false },
    modules: [moduleSchema],
    enrolledCount: { type: Number, default: 0 },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
