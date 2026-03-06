require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');
const { Quiz } = require('../src/models/Quiz');

const seed = async () => {
    await connectDB();
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Quiz.deleteMany({});

    console.log('🌱 Seeding database...');

    // Users
    const admin = await User.create({ name: 'Admin User', email: 'admin@visin.com', password: 'Admin@123456', role: 'admin' });
    const sponsor = await User.create({ name: 'Sponsor Corp', email: 'sponsor@visin.com', password: 'Sponsor@123', role: 'sponsor' });
    const students = await User.insertMany([
        { name: 'Alice Johnson', email: 'alice@student.com', password: await bcrypt.hash('Student@123', 12), role: 'student', xp: 1620, streak: 7 },
        { name: 'Bob Smith', email: 'bob@student.com', password: await bcrypt.hash('Student@123', 12), role: 'student', xp: 480, streak: 2 },
        { name: 'Carol White', email: 'carol@student.com', password: await bcrypt.hash('Student@123', 12), role: 'student', xp: 3200, streak: 15 },
        { name: 'David Lee', email: 'david@student.com', password: await bcrypt.hash('Student@123', 12), role: 'student', xp: 150, streak: 0 },
        { name: 'Eva Chen', email: 'eva@student.com', password: await bcrypt.hash('Student@123', 12), role: 'student', xp: 6100, streak: 30 },
    ]);

    // Courses
    const course1 = await Course.create({
        title: 'Full-Stack Web Development',
        description: 'Master HTML, CSS, JavaScript, React, Node, MongoDB from scratch to deployment.',
        category: 'Development', level: 'Beginner', duration: 40, instructor: 'Dr. Sarah Tech', isPublished: true, enrolledCount: 134, createdBy: admin._id,
        modules: [
            { title: 'HTML Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: 45, order: 1, xpReward: 20, isLocked: false },
            { title: 'CSS Mastery', type: 'video', videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI', duration: 60, order: 2, xpReward: 20, isLocked: false },
            { title: 'JavaScript Essentials', type: 'text', content: 'Learn JS variables, functions, DOM manipulation, and ES6 features.', duration: 90, order: 3, xpReward: 20, isLocked: false },
            { title: 'React Basics Project', type: 'project', content: 'Build a Todo app using React hooks.', duration: 120, order: 4, xpReward: 100, isLocked: true },
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'React']
    });

    const course2 = await Course.create({
        title: 'Data Science with Python',
        description: 'Pandas, NumPy, Matplotlib, Scikit-Learn, Machine Learning pipelines.',
        category: 'Data Science', level: 'Intermediate', duration: 35, instructor: 'Prof. Alan Turing', isPublished: true, enrolledCount: 89, createdBy: admin._id,
        modules: [
            { title: 'Python Review', type: 'video', videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', duration: 30, order: 1, xpReward: 20, isLocked: false },
            { title: 'NumPy & Pandas', type: 'text', content: 'Working with arrays and data frames.', duration: 60, order: 2, xpReward: 20, isLocked: false },
            { title: 'ML Pipeline Project', type: 'project', content: 'Train a classification model.', duration: 180, order: 3, xpReward: 100, isLocked: true },
        ],
        tags: ['Python', 'ML', 'Data Science']
    });

    // Enroll students
    await Enrollment.create({ student: students[0]._id, course: course1._id, completedModules: [course1.modules[0]._id, course1.modules[1]._id], completionPercent: 50 });
    await Enrollment.create({ student: students[1]._id, course: course1._id, completedModules: [course1.modules[0]._id], completionPercent: 25 });
    await Enrollment.create({ student: students[2]._id, course: course2._id, completedModules: [course2.modules[0]._id, course2.modules[1]._id, course2.modules[2]._id], completionPercent: 100 });
    await Enrollment.create({ student: students[4]._id, course: course1._id, completedModules: [course1.modules[0]._id, course1.modules[1]._id, course1.modules[2]._id, course1.modules[3]._id], completionPercent: 100 });

    // Quiz
    await Quiz.create({
        title: 'HTML & CSS Quiz', course: course1._id, moduleId: course1.modules[1]._id, passingScore: 70, xpReward: 50,
        questions: [
            { question: 'What does HTML stand for?', options: [{ text: 'HyperText Markup Language', isCorrect: true }, { text: 'HighTech Modern Language', isCorrect: false }, { text: 'Hyper Transfer Mode Link', isCorrect: false }, { text: 'None', isCorrect: false }] },
            { question: 'Which CSS property changes text color?', options: [{ text: 'background', isCorrect: false }, { text: 'font-style', isCorrect: false }, { text: 'color', isCorrect: true }, { text: 'text-color', isCorrect: false }] },
            { question: 'What is the CSS Box Model?', options: [{ text: 'A 3D rendering engine', isCorrect: false }, { text: 'Content, Padding, Border, Margin', isCorrect: true }, { text: 'Header, Body, Footer', isCorrect: false }, { text: 'None', isCorrect: false }] },
        ]
    });

    console.log('✅ Seeding complete!');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin:   admin@visin.com   / Admin@123456');
    console.log('Sponsor: sponsor@visin.com / Sponsor@123');
    console.log('Student: alice@student.com / Student@123');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
