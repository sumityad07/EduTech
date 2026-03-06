const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }
    // Mongoose validation
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
    if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

    res.status(statusCode).json({ success: false, message, errors: err.errors || [] });
};

module.exports = errorHandler;
