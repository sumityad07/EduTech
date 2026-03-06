const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const generateTokens = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
    return { token, refreshToken };
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',   // changed from 'strict' → works across localhost ports
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) throw new ApiError(400, 'Email already registered');
        const user = await User.create({ name, email, password, role: role || 'student' });
        const { token } = generateTokens(user._id);
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            success: true, token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, xp: user.xp, streak: user.streak, level: user.getLevel() }
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err.message);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new ApiError(400, 'Email and password required');

        // Get user with password field
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) throw new ApiError(401, 'Invalid email or password');

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw new ApiError(401, 'Invalid email or password');

        // Update streak + XP + lastLogin WITHOUT triggering save() hooks — use updateOne
        const now = new Date();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        let newStreak = user.streak || 0;
        let xpGain = 0;

        if (lastLogin) {
            const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) { newStreak += 1; xpGain = 10; }
            else if (diffDays > 1) { newStreak = 1; xpGain = 0; }
            // Same day: no change
        } else {
            newStreak = 1;
            xpGain = 10;
        }

        const newXP = (user.xp || 0) + xpGain;

        // Use updateOne to bypass pre-save hooks and validation entirely
        await User.updateOne({ _id: user._id }, { $set: { streak: newStreak, xp: newXP, lastLogin: now } });

        // Compute level based on updated XP
        const getLevel = (xp) => {
            if (xp >= 6000) return 'Master';
            if (xp >= 3000) return 'Expert';
            if (xp >= 1500) return 'Advanced';
            if (xp >= 500) return 'Intermediate';
            return 'Beginner';
        };

        const { token } = generateTokens(user._id);
        res.cookie('token', token, cookieOptions);

        console.log(`✅ Login success: ${email} [${user.role}]`);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: newXP,
                streak: newStreak,
                level: getLevel(newXP),
                avatar: user.avatar || '',
            }
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err.message, err.stack);
        next(err);
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', '', { maxAge: 0 });
    res.json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new ApiError(404, 'User not found');
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                streak: user.streak,
                level: user.getLevel(),
                avatar: user.avatar || ''
            }
        });
    } catch (err) {
        console.error('GETME ERROR:', err.message);
        next(err);
    }
};
