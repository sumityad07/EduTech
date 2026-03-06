const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'admin', 'sponsor'], default: 'student' },
    avatar: { type: String, default: '' },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    sponsoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notifications: [{
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    activityLog: [{ action: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getLevel = function () {
    const xp = this.xp;
    if (xp >= 6000) return 'Master';
    if (xp >= 3000) return 'Expert';
    if (xp >= 1500) return 'Advanced';
    if (xp >= 500) return 'Intermediate';
    return 'Beginner';
};

module.exports = mongoose.model('User', userSchema);
