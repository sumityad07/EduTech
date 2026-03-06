const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) throw new ApiError(401, 'Not authenticated');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) throw new ApiError(401, 'User not found');
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { protect };
