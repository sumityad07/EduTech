require('dotenv').config();
// Override DNS to use Google's public DNS (8.8.8.8) — local DNS can't resolve Atlas hostnames
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const sponsorRoutes = require('./src/routes/sponsorRoutes');



const app = express();

// Connect DB
connectDB();


// Security Middleware
app.use(helmet());
const corsOrigin = process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : (origin, cb) => {
        // Allow any localhost port in development (Vite may use 5173, 5174, 5176, etc.)
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    };
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' }));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/sponsor', sponsorRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
