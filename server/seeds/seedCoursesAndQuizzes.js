// Seeds 6 courses + quizzes into MongoDB, linking each video module to its quiz via quizId
const dns = require('dns'); dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Course = require('../src/models/Course');
const { Quiz } = require('../src/models/Quiz');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses & quizzes
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing courses & quizzes');

    // ──────────────────────────────────────────
    // 1. Create quizzes first (need their _ids)
    // ──────────────────────────────────────────
    const quizData = [
        {
            title: 'HTML Fundamentals Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
            questions: [
                { question: 'What does HTML stand for?', options: [{ text: 'Hyper Text Markup Language', isCorrect: true }, { text: 'High Tech Modern Language', isCorrect: false }, { text: 'Hyper Transfer Markup Links', isCorrect: false }, { text: 'Home Tool Markup Language', isCorrect: false }], explanation: 'HTML = HyperText Markup Language.' },
                { question: 'Which tag creates the largest heading?', options: [{ text: '<h6>', isCorrect: false }, { text: '<h1>', isCorrect: true }, { text: '<head>', isCorrect: false }, { text: '<header>', isCorrect: false }], explanation: '<h1> is the largest heading.' },
                { question: 'Which attribute specifies a link destination?', options: [{ text: 'src', isCorrect: false }, { text: 'href', isCorrect: true }, { text: 'link', isCorrect: false }, { text: 'url', isCorrect: false }], explanation: 'href on <a> specifies the URL.' },
            ]
        },
        {
            title: 'CSS Mastery Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
            questions: [
                { question: 'What does CSS stand for?', options: [{ text: 'Cascading Style Sheets', isCorrect: true }, { text: 'Creative Style Scripts', isCorrect: false }, { text: 'Computer Style System', isCorrect: false }, { text: 'Content Styling Syntax', isCorrect: false }], explanation: 'CSS = Cascading Style Sheets.' },
                { question: 'Which CSS property changes text color?', options: [{ text: 'font-color', isCorrect: false }, { text: 'text-color', isCorrect: false }, { text: 'color', isCorrect: true }, { text: 'foreground', isCorrect: false }], explanation: 'The "color" property sets text color.' },
                { question: 'CSS box model order (inside out)?', options: [{ text: 'Content→Margin→Border→Padding', isCorrect: false }, { text: 'Content→Padding→Border→Margin', isCorrect: true }, { text: 'Padding→Content→Border→Margin', isCorrect: false }, { text: 'Content→Border→Padding→Margin', isCorrect: false }], explanation: 'Content → Padding → Border → Margin.' },
            ]
        },
        {
            title: 'JavaScript Essentials Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
            questions: [
                { question: 'Which method adds an element to the end of an array?', options: [{ text: 'push()', isCorrect: true }, { text: 'pop()', isCorrect: false }, { text: 'shift()', isCorrect: false }, { text: 'unshift()', isCorrect: false }], explanation: 'push() adds to the end.' },
                { question: 'What does "==" check vs "==="?', options: [{ text: 'They are identical', isCorrect: false }, { text: '== checks value only; === checks value AND type', isCorrect: true }, { text: '=== checks value only', isCorrect: false }, { text: '== is stricter', isCorrect: false }], explanation: '=== checks both value and type.' },
                { question: 'Output of typeof undefined?', options: [{ text: '"null"', isCorrect: false }, { text: '"object"', isCorrect: false }, { text: '"undefined"', isCorrect: true }, { text: '"boolean"', isCorrect: false }], explanation: 'typeof undefined returns "undefined".' },
            ]
        },
        {
            title: 'React.js Fundamentals Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
            questions: [
                { question: 'What is JSX?', options: [{ text: 'A JavaScript framework', isCorrect: false }, { text: 'JavaScript + HTML syntax extension for React', isCorrect: true }, { text: 'A CSS preprocessor', isCorrect: false }, { text: 'A database query language', isCorrect: false }], explanation: 'JSX is React\'s HTML-in-JS syntax.' },
                { question: 'What does useState hook return?', options: [{ text: 'A single value', isCorrect: false }, { text: 'An array: [currentState, setterFunction]', isCorrect: true }, { text: 'An object with get/set', isCorrect: false }, { text: 'A Promise', isCorrect: false }], explanation: 'useState returns [state, setState].' },
                { question: 'When does useEffect run?', options: [{ text: 'Only on first render', isCorrect: false }, { text: 'After every render', isCorrect: false }, { text: 'After render, when dependencies change', isCorrect: true }, { text: 'Before the component renders', isCorrect: false }], explanation: 'useEffect runs after render based on deps.' },
            ]
        },
        {
            title: 'Node.js & Express Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
            questions: [
                { question: 'What is Node.js?', options: [{ text: 'A browser extension', isCorrect: false }, { text: 'A JavaScript runtime built on Chrome V8', isCorrect: true }, { text: 'A frontend CSS framework', isCorrect: false }, { text: 'A database', isCorrect: false }], explanation: 'Node.js runs JS server-side using V8.' },
                { question: 'What does Express middleware do?', options: [{ text: 'Connects to databases automatically', isCorrect: false }, { text: 'Functions with access to req, res, and next()', isCorrect: true }, { text: 'Renders HTML templates', isCorrect: false }, { text: 'Handles authentication only', isCorrect: false }], explanation: 'Middleware processes requests before route handlers.' },
            ]
        },
        {
            title: 'Python Basics Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
            questions: [
                { question: 'How do you create a list in Python?', options: [{ text: 'Using {curly braces}', isCorrect: false }, { text: 'Using (parentheses)', isCorrect: false }, { text: 'Using [square brackets]', isCorrect: true }, { text: 'Using <angle brackets>', isCorrect: false }], explanation: 'Lists use square brackets: [1, 2, 3].' },
                { question: 'What does "len()" do?', options: [{ text: 'Returns the last element', isCorrect: false }, { text: 'Returns the number of items', isCorrect: true }, { text: 'Sorts the list', isCorrect: false }, { text: 'Removes duplicates', isCorrect: false }], explanation: 'len() returns number of elements.' },
            ]
        },
        {
            title: 'NumPy & Pandas Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
            questions: [
                { question: 'Function to create a NumPy array from a list?', options: [{ text: 'np.array()', isCorrect: true }, { text: 'np.list()', isCorrect: false }, { text: 'np.create()', isCorrect: false }, { text: 'np.make()', isCorrect: false }], explanation: 'np.array([1,2,3]) converts list to ndarray.' },
                { question: 'What is a Pandas DataFrame?', options: [{ text: 'A 1D array', isCorrect: false }, { text: 'A 2D table-like data structure with labeled axes', isCorrect: true }, { text: 'A dictionary', isCorrect: false }, { text: 'A database connector', isCorrect: false }], explanation: 'DataFrame is a 2D table in Pandas.' },
            ]
        },
        {
            title: 'Machine Learning Concepts Quiz', passingScore: 70, xpReward: 50, timeLimit: 15,
            questions: [
                { question: 'What is supervised learning?', options: [{ text: 'Model learns without labeled data', isCorrect: false }, { text: 'Model learns from labeled input-output pairs', isCorrect: true }, { text: 'Model learns by reward/punishment', isCorrect: false }, { text: 'Model clusters similar data', isCorrect: false }], explanation: 'Supervised learning uses labeled data.' },
                { question: 'What is overfitting?', options: [{ text: 'Model performs poorly on training data', isCorrect: false }, { text: 'Model memorizes training data but fails on new data', isCorrect: true }, { text: 'Model takes too long to train', isCorrect: false }, { text: 'Model uses too many features', isCorrect: false }], explanation: 'Overfitting: great train accuracy, poor generalization.' },
            ]
        },
        {
            title: 'Core Design Principles Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
            questions: [
                { question: 'What does "white space" in design refer to?', options: [{ text: 'White colored background', isCorrect: false }, { text: 'Empty/negative space between elements', isCorrect: true }, { text: 'A specific font style', isCorrect: false }, { text: 'Blank images', isCorrect: false }], explanation: 'White space = negative space around elements.' },
                { question: 'What is the Rule of Thirds?', options: [{ text: 'Divide design into 3 equal columns', isCorrect: false }, { text: 'Use exactly 3 colors', isCorrect: false }, { text: 'Place focal points at 3x3 grid intersections', isCorrect: true }, { text: 'Use 3 fonts maximum', isCorrect: false }], explanation: 'Rule of Thirds places key elements at grid intersections.' },
            ]
        },
        {
            title: 'Figma Basics Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
            questions: [
                { question: 'What is a Figma "Component"?', options: [{ text: 'A standalone image file', isCorrect: false }, { text: 'A reusable design element with instances', isCorrect: true }, { text: 'An animation frame', isCorrect: false }, { text: 'A color palette', isCorrect: false }], explanation: 'Components are reusable elements; editing master updates all instances.' },
                { question: 'What does "Auto Layout" in Figma do?', options: [{ text: 'Automatically picks colors', isCorrect: false }, { text: 'Exports designs automatically', isCorrect: false }, { text: 'Resizes frames dynamically based on content', isCorrect: true }, { text: 'Creates animations', isCorrect: false }], explanation: 'Auto Layout resizes frames like CSS Flexbox.' },
            ]
        },
        {
            title: 'Docker Essentials Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
            questions: [
                { question: 'What is a Docker container?', options: [{ text: 'A virtual machine', isCorrect: false }, { text: 'A lightweight, isolated runtime environment', isCorrect: true }, { text: 'A cloud server', isCorrect: false }, { text: 'A database', isCorrect: false }], explanation: 'Containers are isolated but share the host OS kernel.' },
                { question: 'What does a Dockerfile define?', options: [{ text: 'Server configuration only', isCorrect: false }, { text: 'Instructions to build a Docker image', isCorrect: true }, { text: 'Network settings', isCorrect: false }, { text: 'Container running order', isCorrect: false }], explanation: 'Dockerfile = instructions to build a Docker image.' },
            ]
        },
        {
            title: 'SQL Fundamentals Quiz', passingScore: 70, xpReward: 35, timeLimit: 10,
            questions: [
                { question: 'Which SQL clause filters rows?', options: [{ text: 'GROUP BY', isCorrect: false }, { text: 'HAVING', isCorrect: false }, { text: 'WHERE', isCorrect: true }, { text: 'ORDER BY', isCorrect: false }], explanation: 'WHERE filters rows; HAVING filters after GROUP BY.' },
                { question: 'What does JOIN do in SQL?', options: [{ text: 'Combines rows from tables based on related column', isCorrect: true }, { text: 'Adds a column to a table', isCorrect: false }, { text: 'Sorts data', isCorrect: false }, { text: 'Counts rows', isCorrect: false }], explanation: 'JOIN merges rows from multiple tables.' },
            ]
        },
    ];

    const quizzes = await Quiz.insertMany(quizData);
    console.log(`✅ Created ${quizzes.length} quizzes`);

    // Helper to get quiz by title
    const qByTitle = (title) => quizzes.find(q => q.title === title)?._id;

    // ──────────────────────────────────────────
    // 2. Create courses with quizId on modules
    // ──────────────────────────────────────────
    const coursesData = [
        {
            title: 'Full-Stack Web Development', category: 'Development', level: 'Beginner',
            duration: 40, instructor: 'Dr. Sarah Tech', enrolledCount: 134, isPublished: true,
            description: 'Master HTML, CSS, JavaScript, React, and Node.js from the ground up. Build real projects.',
            tags: ['HTML', 'CSS', 'JavaScript', 'React'],
            modules: [
                { title: 'HTML Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 45, order: 1, xpReward: 20, isLocked: false, quizId: qByTitle('HTML Fundamentals Quiz') },
                { title: 'CSS Mastery', type: 'video', videoUrl: 'https://www.youtube.com/embed/yfoY53QXEnI', duration: 60, order: 2, xpReward: 20, isLocked: false, quizId: qByTitle('CSS Mastery Quiz') },
                { title: 'JavaScript Essentials', type: 'video', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: 90, order: 3, xpReward: 25, isLocked: false, quizId: qByTitle('JavaScript Essentials Quiz') },
                { title: 'React.js Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', duration: 75, order: 4, xpReward: 30, isLocked: false, quizId: qByTitle('React.js Fundamentals Quiz') },
                { title: 'Node.js & Express', type: 'video', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', duration: 80, order: 5, xpReward: 30, isLocked: false, quizId: qByTitle('Node.js & Express Quiz') },
                { title: 'Full-Stack Project', type: 'project', content: 'Build a complete Todo app with React + Node.js + MongoDB.', duration: 180, order: 6, xpReward: 100, isLocked: true },
            ]
        },
        {
            title: 'Data Science with Python', category: 'Data Science', level: 'Intermediate',
            duration: 35, instructor: 'Prof. Alan Turing', enrolledCount: 89, isPublished: true,
            description: 'Learn Pandas, NumPy, data visualization, and build ML pipelines with Python.',
            tags: ['Python', 'ML', 'Data', 'Pandas'],
            modules: [
                { title: 'Python for Data Science', type: 'video', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: 30, order: 1, xpReward: 20, isLocked: false, quizId: qByTitle('Python Basics Quiz') },
                { title: 'NumPy & Pandas Deep Dive', type: 'video', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: 60, order: 2, xpReward: 25, isLocked: false, quizId: qByTitle('NumPy & Pandas Quiz') },
                { title: 'Machine Learning Basics', type: 'video', videoUrl: 'https://www.youtube.com/embed/GwIo3gDZCVQ', duration: 75, order: 3, xpReward: 30, isLocked: false, quizId: qByTitle('Machine Learning Concepts Quiz') },
                { title: 'ML Pipeline Project', type: 'project', content: 'Train a classification model on the Iris dataset.', duration: 180, order: 4, xpReward: 100, isLocked: true },
            ]
        },
        {
            title: 'UI/UX Design Fundamentals', category: 'Design', level: 'Beginner',
            duration: 20, instructor: 'Emma Rodriguez', enrolledCount: 202, isPublished: true,
            description: 'Master Figma, design systems, color theory, typography, and prototyping.',
            tags: ['UI', 'UX', 'Figma', 'Design'],
            modules: [
                { title: 'Core Design Principles', type: 'video', videoUrl: 'https://www.youtube.com/embed/YiLUYf4HDh4', duration: 40, order: 1, xpReward: 20, isLocked: false, quizId: qByTitle('Core Design Principles Quiz') },
                { title: 'Figma Basics & Components', type: 'video', videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8', duration: 50, order: 2, xpReward: 20, isLocked: false, quizId: qByTitle('Figma Basics Quiz') },
                { title: 'Portfolio Design Project', type: 'project', content: 'Design a personal portfolio in Figma with auto layout.', duration: 120, order: 3, xpReward: 80, isLocked: false },
            ]
        },
        {
            title: 'DevOps & Cloud Engineering', category: 'DevOps', level: 'Advanced',
            duration: 50, instructor: 'Carlos Mendes', enrolledCount: 45, isPublished: true,
            description: 'Master Docker, Kubernetes, AWS, and build CI/CD pipelines for production systems.',
            tags: ['Docker', 'K8s', 'AWS', 'CI/CD'],
            modules: [
                { title: 'Docker Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo', duration: 60, order: 1, xpReward: 25, isLocked: false, quizId: qByTitle('Docker Essentials Quiz') },
                { title: 'Kubernetes Crash Course', type: 'video', videoUrl: 'https://www.youtube.com/embed/s_o8dwzRlu4', duration: 90, order: 2, xpReward: 30, isLocked: false },
                { title: 'CI/CD with GitHub Actions', type: 'video', videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI', duration: 75, order: 3, xpReward: 30, isLocked: true },
            ]
        },
        {
            title: 'SQL & Database Design', category: 'Data Science', level: 'Beginner',
            duration: 25, instructor: 'Dr. Kim Park', enrolledCount: 67, isPublished: true,
            description: 'Learn SQL from scratch — queries, joins, aggregation, and database design.',
            tags: ['SQL', 'Database', 'PostgreSQL', 'MySQL'],
            modules: [
                { title: 'SQL Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', duration: 45, order: 1, xpReward: 20, isLocked: false, quizId: qByTitle('SQL Fundamentals Quiz') },
                { title: 'Advanced SQL & Joins', type: 'video', videoUrl: 'https://www.youtube.com/embed/2bW3HuaAUcY', duration: 50, order: 2, xpReward: 25, isLocked: false },
                { title: 'Database Design Project', type: 'project', content: 'Design a schema for an e-commerce platform.', duration: 90, order: 3, xpReward: 80, isLocked: false },
            ]
        },
        {
            title: 'Business English & Communication', category: 'Business', level: 'Intermediate',
            duration: 15, instructor: 'Lisa Chen', enrolledCount: 156, isPublished: true,
            description: 'Master professional communication, email writing, presentations, and negotiation.',
            tags: ['Business', 'English', 'Communication', 'Soft Skills'],
            modules: [
                { title: 'Business Communication Essentials', type: 'video', videoUrl: 'https://www.youtube.com/embed/LlIa5DqBqSc', duration: 35, order: 1, xpReward: 15, isLocked: false },
                { title: 'Professional Email Writing', type: 'text', content: 'Learn to write clear, professional emails.', duration: 20, order: 2, xpReward: 15, isLocked: false },
                { title: 'Presentation Skills', type: 'video', videoUrl: 'https://www.youtube.com/embed/V8eLdbKXGzk', duration: 30, order: 3, xpReward: 20, isLocked: false },
            ]
        },
    ];

    const courses = await Course.insertMany(coursesData);
    console.log(`✅ Created ${courses.length} courses`);

    // Update each quiz with the correct course reference
    for (const course of courses) {
        for (const mod of course.modules) {
            if (mod.quizId) {
                await Quiz.findByIdAndUpdate(mod.quizId, {
                    $set: { course: course._id, moduleId: mod._id }
                });
            }
        }
    }
    console.log('✅ Updated quiz course/moduleId references');

    console.log('\n🎉 Seed complete!');
    console.log('Courses:', courses.map(c => `  - ${c.title} (${c.modules.length} modules)`).join('\n'));
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => { console.error('❌ Seed error:', err.message); process.exit(1); });
