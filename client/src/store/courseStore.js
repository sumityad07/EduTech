import { create } from 'zustand';
import api from '../api/axios';

// ─────────────────────────────────────────────
//  DEMO QUIZZES — one per video module
// ─────────────────────────────────────────────
export const DEMO_QUIZZES = {
    'q-m1': {
        _id: 'q-m1', title: 'HTML Fundamentals Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
        questions: [
            { _id: 'q1a', question: 'What does HTML stand for?', options: [{ text: 'Hyper Text Markup Language', isCorrect: true }, { text: 'High Tech Modern Language', isCorrect: false }, { text: 'Hyper Transfer Markup Links', isCorrect: false }, { text: 'Home Tool Markup Language', isCorrect: false }], explanation: 'HTML = HyperText Markup Language — the standard for web pages.' },
            { _id: 'q1b', question: 'Which tag is used for the largest heading?', options: [{ text: '<h6>', isCorrect: false }, { text: '<h1>', isCorrect: true }, { text: '<head>', isCorrect: false }, { text: '<header>', isCorrect: false }], explanation: '<h1> is the largest heading, <h6> the smallest.' },
            { _id: 'q1c', question: 'Which HTML attribute specifies hyperlink destination?', options: [{ text: 'src', isCorrect: false }, { text: 'href', isCorrect: true }, { text: 'link', isCorrect: false }, { text: 'url', isCorrect: false }], explanation: 'The href attribute in <a> specifies the URL to navigate to.' },
        ]
    },
    'q-m2': {
        _id: 'q-m2', title: 'CSS Mastery Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
        questions: [
            { _id: 'q2a', question: 'What does CSS stand for?', options: [{ text: 'Cascading Style Sheets', isCorrect: true }, { text: 'Creative Style Scripts', isCorrect: false }, { text: 'Computer Style System', isCorrect: false }, { text: 'Content Styling Syntax', isCorrect: false }], explanation: 'CSS = Cascading Style Sheets — controls the visual presentation of HTML.' },
            { _id: 'q2b', question: 'Which CSS property changes text color?', options: [{ text: 'font-color', isCorrect: false }, { text: 'text-color', isCorrect: false }, { text: 'color', isCorrect: true }, { text: 'foreground', isCorrect: false }], explanation: 'The "color" property sets the text color in CSS.' },
            { _id: 'q2c', question: 'What is the CSS box model order from inside out?', options: [{ text: 'Content → Margin → Border → Padding', isCorrect: false }, { text: 'Content → Padding → Border → Margin', isCorrect: true }, { text: 'Padding → Content → Border → Margin', isCorrect: false }, { text: 'Content → Border → Padding → Margin', isCorrect: false }], explanation: 'Box model: Content → Padding → Border → Margin.' },
        ]
    },
    'q-m3': {
        _id: 'q-m3', title: 'JavaScript Essentials Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
        questions: [
            { _id: 'q3a', question: 'Which method adds an element to the end of an array?', options: [{ text: 'push()', isCorrect: true }, { text: 'pop()', isCorrect: false }, { text: 'shift()', isCorrect: false }, { text: 'unshift()', isCorrect: false }], explanation: 'push() adds to the end; pop() removes from the end.' },
            { _id: 'q3b', question: 'What does "==" check vs "==="?', options: [{ text: 'They are identical', isCorrect: false }, { text: '== checks value only; === checks value AND type', isCorrect: true }, { text: '=== checks value only; == checks value AND type', isCorrect: false }, { text: '== is stricter', isCorrect: false }], explanation: '=== (strict equality) checks both value and type, preventing type coercion bugs.' },
            { _id: 'q3c', question: 'What is the output of typeof undefined?', options: [{ text: '"null"', isCorrect: false }, { text: '"object"', isCorrect: false }, { text: '"undefined"', isCorrect: true }, { text: '"boolean"', isCorrect: false }], explanation: 'typeof undefined returns "undefined".' },
        ]
    },
    'q-m5': {
        _id: 'q-m5', title: 'Python Basics Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
        questions: [
            { _id: 'q5a', question: 'How do you create a list in Python?', options: [{ text: 'Using {curly braces}', isCorrect: false }, { text: 'Using (parentheses)', isCorrect: false }, { text: 'Using [square brackets]', isCorrect: true }, { text: 'Using <angle brackets>', isCorrect: false }], explanation: 'Lists in Python use square brackets: [1, 2, 3].' },
            { _id: 'q5b', question: 'What does "len()" do?', options: [{ text: 'Returns the last element', isCorrect: false }, { text: 'Returns the number of items', isCorrect: true }, { text: 'Sorts the list', isCorrect: false }, { text: 'Removes duplicates', isCorrect: false }], explanation: 'len() returns the number of elements in a sequence.' },
        ]
    },
    'q-m6': {
        _id: 'q-m6', title: 'NumPy & Pandas Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
        questions: [
            { _id: 'q6a', question: 'Which function creates a NumPy array from a list?', options: [{ text: 'np.array()', isCorrect: true }, { text: 'np.list()', isCorrect: false }, { text: 'np.create()', isCorrect: false }, { text: 'np.make()', isCorrect: false }], explanation: 'np.array([1,2,3]) converts a Python list to a NumPy ndarray.' },
            { _id: 'q6b', question: 'What is a Pandas DataFrame?', options: [{ text: 'A 1D array', isCorrect: false }, { text: 'A 2D table-like data structure with labeled axes', isCorrect: true }, { text: 'A dictionary', isCorrect: false }, { text: 'A database connector', isCorrect: false }], explanation: 'DataFrame is the primary Pandas data structure — a 2D table with rows and columns.' },
        ]
    },
    'q-m8': {
        _id: 'q-m8', title: 'Design Principles Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
        questions: [
            { _id: 'q8a', question: 'What does "white space" in design refer to?', options: [{ text: 'White colored background', isCorrect: false }, { text: 'Empty/negative space between elements', isCorrect: true }, { text: 'A specific font style', isCorrect: false }, { text: 'Blank images', isCorrect: false }], explanation: 'White space (negative space) is the empty area around design elements — essential for readability and balance.' },
            { _id: 'q8b', question: 'What is the Rule of Thirds?', options: [{ text: 'Divide design into 3 equal columns', isCorrect: false }, { text: 'Use exactly 3 colors', isCorrect: false }, { text: 'Place focal points at intersection of 2x2 grid lines', isCorrect: true }, { text: 'Use 3 fonts maximum', isCorrect: false }], explanation: 'The Rule of Thirds divides a composition into a 3x3 grid; key elements go at the intersections.' },
        ]
    },
    'q-m9': {
        _id: 'q-m9', title: 'Figma Basics Quiz', passingScore: 70, xpReward: 30, timeLimit: 10,
        questions: [
            { _id: 'q9a', question: 'What is a Figma "Component"?', options: [{ text: 'A standalone image file', isCorrect: false }, { text: 'A reusable design element with instances', isCorrect: true }, { text: 'An animation frame', isCorrect: false }, { text: 'A color palette', isCorrect: false }], explanation: 'Components are reusable elements; editing the master updates all instances.' },
            { _id: 'q9b', question: 'What does "Auto Layout" in Figma do?', options: [{ text: 'Automatically picks colors', isCorrect: false }, { text: 'Exports designs automatically', isCorrect: false }, { text: 'Resizes frames dynamically based on content', isCorrect: true }, { text: 'Creates animations', isCorrect: false }], explanation: 'Auto Layout makes frames resize automatically when content changes — like CSS Flexbox.' },
        ]
    },
    'q-m10': {
        _id: 'q-m10', title: 'Docker Essentials Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
        questions: [
            { _id: 'q10a', question: 'What is a Docker container?', options: [{ text: 'A virtual machine', isCorrect: false }, { text: 'A lightweight, isolated runtime environment', isCorrect: true }, { text: 'A cloud server', isCorrect: false }, { text: 'A database', isCorrect: false }], explanation: 'Containers share the host OS kernel but run in isolated environments — much lighter than VMs.' },
            { _id: 'q10b', question: 'What does a Dockerfile define?', options: [{ text: 'Server configuration only', isCorrect: false }, { text: 'Instructions to build a Docker image', isCorrect: true }, { text: 'Network settings', isCorrect: false }, { text: 'Container running order', isCorrect: false }], explanation: 'A Dockerfile is a text file with instructions to build a Docker image step by step.' },
        ]
    },
    'q-m12': {
        _id: 'q-m12', title: 'SQL Fundamentals Quiz', passingScore: 70, xpReward: 35, timeLimit: 10,
        questions: [
            { _id: 'q12a', question: 'What SQL clause filters rows?', options: [{ text: 'GROUP BY', isCorrect: false }, { text: 'HAVING', isCorrect: false }, { text: 'WHERE', isCorrect: true }, { text: 'ORDER BY', isCorrect: false }], explanation: 'WHERE filters rows before grouping; HAVING filters after GROUP BY.' },
            { _id: 'q12b', question: 'What does JOIN do in SQL?', options: [{ text: 'Combines rows from two or more tables based on related column', isCorrect: true }, { text: 'Adds a column to a table', isCorrect: false }, { text: 'Sorts data', isCorrect: false }, { text: 'Counts rows', isCorrect: false }], explanation: 'JOIN merges rows from multiple tables based on a related column (usually a foreign key).' },
        ]
    },
    'q-m14': {
        _id: 'q-m14', title: 'Machine Learning Concepts Quiz', passingScore: 70, xpReward: 50, timeLimit: 15,
        questions: [
            { _id: 'q14a', question: 'What is supervised learning?', options: [{ text: 'Model learns without labeled data', isCorrect: false }, { text: 'Model learns from labeled input-output pairs', isCorrect: true }, { text: 'Model learns by reward/punishment', isCorrect: false }, { text: 'Model clusters similar data', isCorrect: false }], explanation: 'Supervised learning uses labeled training data (inputs + correct outputs) to learn a mapping function.' },
            { _id: 'q14b', question: 'What is overfitting?', options: [{ text: 'Model performs poorly on training data', isCorrect: false }, { text: 'Model memorizes training data but fails on new data', isCorrect: true }, { text: 'Model takes too long to train', isCorrect: false }, { text: 'Model uses too many features', isCorrect: false }], explanation: 'Overfitting: great train accuracy but poor generalization — the model memorized instead of learning.' },
        ]
    },
    'q-m16': {
        _id: 'q-m16', title: 'React.js Fundamentals Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
        questions: [
            { _id: 'q16a', question: 'What is JSX?', options: [{ text: 'A JavaScript framework', isCorrect: false }, { text: 'JavaScript + HTML syntax extension for React', isCorrect: true }, { text: 'A CSS preprocessor', isCorrect: false }, { text: 'A database query language', isCorrect: false }], explanation: 'JSX lets you write HTML-like syntax in JavaScript — React compiles it to React.createElement calls.' },
            { _id: 'q16b', question: 'What does useState hook return?', options: [{ text: 'A single value', isCorrect: false }, { text: 'An array: [currentState, setterFunction]', isCorrect: true }, { text: 'An object with get/set', isCorrect: false }, { text: 'A Promise', isCorrect: false }], explanation: 'useState returns [state, setState] — use array destructuring to name them.' },
            { _id: 'q16c', question: 'When does useEffect run?', options: [{ text: 'Only on first render', isCorrect: false }, { text: 'After every render', isCorrect: false }, { text: 'After render, when dependencies change', isCorrect: true }, { text: 'Before the component renders', isCorrect: false }], explanation: 'useEffect runs after render. Its dependency array controls when it re-runs.' },
        ]
    },
    'q-m18': {
        _id: 'q-m18', title: 'Node.js & Express Quiz', passingScore: 70, xpReward: 40, timeLimit: 12,
        questions: [
            { _id: 'q18a', question: 'What is Node.js?', options: [{ text: 'A browser extension', isCorrect: false }, { text: 'A JavaScript runtime built on Chrome V8 engine', isCorrect: true }, { text: 'A frontend CSS framework', isCorrect: false }, { text: 'A database', isCorrect: false }], explanation: 'Node.js runs JavaScript on the server side using the V8 engine.' },
            { _id: 'q18b', question: 'What does Express middleware do?', options: [{ text: 'Connects to databases automatically', isCorrect: false }, { text: 'Functions that have access to req, res, and next()', isCorrect: true }, { text: 'Renders HTML templates', isCorrect: false }, { text: 'Handles authentication only', isCorrect: false }], explanation: 'Middleware functions process requests before they reach the route handler.' },
        ]
    },
};

// ─────────────────────────────────────────────
//  DEMO COURSES — 6 courses with YouTube links
//  and quiz per video module
// ─────────────────────────────────────────────
const DEMO_COURSES = [
    {
        _id: 'c1', title: 'Full-Stack Web Development', category: 'Development', level: 'Beginner',
        duration: 40, instructor: 'Dr. Sarah Tech', enrolledCount: 134, isPublished: true,
        thumbnail: '',
        description: 'Master HTML, CSS, JavaScript, React, and Node.js from the ground up. Build real projects.',
        tags: ['HTML', 'CSS', 'JavaScript', 'React'],
        modules: [
            { _id: 'm1', title: 'HTML Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 45, order: 1, xpReward: 20, isLocked: false, quizId: 'q-m1' },
            { _id: 'm2', title: 'CSS Mastery', type: 'video', videoUrl: 'https://www.youtube.com/embed/yfoY53QXEnI', duration: 60, order: 2, xpReward: 20, isLocked: false, quizId: 'q-m2' },
            { _id: 'm3', title: 'JavaScript Essentials', type: 'video', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: 90, order: 3, xpReward: 25, isLocked: false, quizId: 'q-m3' },
            { _id: 'm16', title: 'React.js Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', duration: 75, order: 4, xpReward: 30, isLocked: false, quizId: 'q-m16' },
            { _id: 'm18', title: 'Node.js & Express', type: 'video', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', duration: 80, order: 5, xpReward: 30, isLocked: false, quizId: 'q-m18' },
            { _id: 'm4', title: 'Full-Stack Project', type: 'project', content: 'Build a complete Todo app with React frontend and Node.js backend + MongoDB.', duration: 180, order: 6, xpReward: 100, isLocked: true },
        ]
    },
    {
        _id: 'c2', title: 'Data Science with Python', category: 'Data Science', level: 'Intermediate',
        duration: 35, instructor: 'Prof. Alan Turing', enrolledCount: 89, isPublished: true,
        thumbnail: '',
        description: 'Learn Pandas, NumPy, data visualization, and build ML pipelines with Python.',
        tags: ['Python', 'ML', 'Data', 'Pandas'],
        modules: [
            { _id: 'm5', title: 'Python for Data Science', type: 'video', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: 30, order: 1, xpReward: 20, isLocked: false, quizId: 'q-m5' },
            { _id: 'm6', title: 'NumPy & Pandas Deep Dive', type: 'video', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: 60, order: 2, xpReward: 25, isLocked: false, quizId: 'q-m6' },
            { _id: 'm14', title: 'Machine Learning Basics', type: 'video', videoUrl: 'https://www.youtube.com/embed/GwIo3gDZCVQ', duration: 75, order: 3, xpReward: 30, isLocked: false, quizId: 'q-m14' },
            { _id: 'm7', title: 'ML Pipeline Project', type: 'project', content: 'Train a classification model on the Iris dataset and evaluate its performance.', duration: 180, order: 4, xpReward: 100, isLocked: true },
        ]
    },
    {
        _id: 'c3', title: 'UI/UX Design Fundamentals', category: 'Design', level: 'Beginner',
        duration: 20, instructor: 'Emma Rodriguez', enrolledCount: 202, isPublished: true,
        thumbnail: '',
        description: 'Master Figma, design systems, color theory, typography, and prototyping.',
        tags: ['UI', 'UX', 'Figma', 'Design'],
        modules: [
            { _id: 'm8', title: 'Core Design Principles', type: 'video', videoUrl: 'https://www.youtube.com/embed/YiLUYf4HDh4', duration: 40, order: 1, xpReward: 20, isLocked: false, quizId: 'q-m8' },
            { _id: 'm9', title: 'Figma Basics & Components', type: 'video', videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8', duration: 50, order: 2, xpReward: 20, isLocked: false, quizId: 'q-m9' },
            { _id: 'm15', title: 'Portfolio Design Project', type: 'project', content: 'Design a personal portfolio page in Figma with proper components and auto layout.', duration: 120, order: 3, xpReward: 80, isLocked: false },
        ]
    },
    {
        _id: 'c4', title: 'DevOps & Cloud Engineering', category: 'DevOps', level: 'Advanced',
        duration: 50, instructor: 'Carlos Mendes', enrolledCount: 45, isPublished: true,
        thumbnail: '',
        description: 'Master Docker, Kubernetes, AWS, and build CI/CD pipelines for production systems.',
        tags: ['Docker', 'K8s', 'AWS', 'CI/CD'],
        modules: [
            { _id: 'm10', title: 'Docker Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo', duration: 60, order: 1, xpReward: 25, isLocked: false, quizId: 'q-m10' },
            { _id: 'm11', title: 'Kubernetes Crash Course', type: 'video', videoUrl: 'https://www.youtube.com/embed/s_o8dwzRlu4', duration: 90, order: 2, xpReward: 30, isLocked: false },
            { _id: 'm13', title: 'CI/CD with GitHub Actions', type: 'video', videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI', duration: 75, order: 3, xpReward: 30, isLocked: true },
        ]
    },
    {
        _id: 'c5', title: 'SQL & Database Design', category: 'Data Science', level: 'Beginner',
        duration: 25, instructor: 'Dr. Kim Park', enrolledCount: 67, isPublished: true,
        thumbnail: '',
        description: 'Learn SQL from scratch — queries, joins, aggregation, and database design principles.',
        tags: ['SQL', 'Database', 'PostgreSQL', 'MySQL'],
        modules: [
            { _id: 'm12', title: 'SQL Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', duration: 45, order: 1, xpReward: 20, isLocked: false, quizId: 'q-m12' },
            { _id: 'm12b', title: 'Advanced SQL & Joins', type: 'video', videoUrl: 'https://www.youtube.com/embed/2bW3HuaAUcY', duration: 50, order: 2, xpReward: 25, isLocked: false },
            { _id: 'm12c', title: 'Database Design Project', type: 'project', content: 'Design a database schema for an e-commerce platform with products, users, and orders.', duration: 90, order: 3, xpReward: 80, isLocked: false },
        ]
    },
    {
        _id: 'c6', title: 'Business English & Communication', category: 'Business', level: 'Intermediate',
        duration: 15, instructor: 'Lisa Chen', enrolledCount: 156, isPublished: true,
        thumbnail: '',
        description: 'Master professional communication, email writing, presentations, and negotiation.',
        tags: ['Business', 'English', 'Communication', 'Soft Skills'],
        modules: [
            { _id: 'm20', title: 'Business Communication Essentials', type: 'video', videoUrl: 'https://www.youtube.com/embed/LlIa5DqBqSc', duration: 35, order: 1, xpReward: 15, isLocked: false },
            { _id: 'm21', title: 'Professional Email Writing', type: 'text', content: 'Learn to write clear, concise, and professional emails. Cover subject lines, greetings, body structure, and closings.', duration: 20, order: 2, xpReward: 15, isLocked: false },
            { _id: 'm22', title: 'Presentation Skills', type: 'video', videoUrl: 'https://www.youtube.com/embed/V8eLdbKXGzk', duration: 30, order: 3, xpReward: 20, isLocked: false },
        ]
    },
];

export const useCourseStore = create((set, get) => ({
    allCourses: DEMO_COURSES,
    enrolledCourses: [],
    completedModules: {}, // { courseId: [moduleId, ...] }
    loading: false,
    error: null,

    fetchCourses: async () => {
        const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
        if (stored?.state?.token === 'demo-token') return;
        set({ loading: true });
        try {
            const { data } = await api.get('/courses');
            set({ allCourses: data.data?.length > 0 ? data.data : DEMO_COURSES, loading: false });
        } catch (_) { set({ allCourses: DEMO_COURSES, loading: false }); }
    },

    fetchEnrolled: async () => {
        const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
        if (stored?.state?.token === 'demo-token') return;
        try {
            const { data } = await api.get('/courses/enrolled');
            set({ enrolledCourses: data.data || [] });
        } catch (_) { }
    },

    seedDemo: () => {
        const courses = get().allCourses;
        const c1 = courses.find(c => c._id === 'c1') || courses[0];
        const c2 = courses.find(c => c._id === 'c2') || courses[1];
        if (!c1) return;
        set({
            enrolledCourses: [
                { _id: 'demo-enr-c1', course: c1, completedModules: [c1.modules?.[0]?._id, c1.modules?.[1]?._id].filter(Boolean), completionPercent: 40 },
                ...(c2 ? [{ _id: 'demo-enr-c2', course: c2, completedModules: [c2.modules?.[0]?._id].filter(Boolean), completionPercent: 25 }] : []),
            ],
            completedModules: {
                'c1': [c1.modules?.[0]?._id, c1.modules?.[1]?._id].filter(Boolean),
                ...(c2 ? { 'c2': [c2.modules?.[0]?._id].filter(Boolean) } : {}),
            },
        });
    },

    enroll: (courseId) => {
        const course = get().allCourses.find(c => c._id === courseId);
        if (!course) return;
        const already = get().enrolledCourses.some(e => (e.course?._id || e._id) === courseId);
        if (already) return;
        const enrollment = { _id: `enr-${courseId}`, course, completedModules: [], completionPercent: 0 };
        set(s => ({ enrolledCourses: [...s.enrolledCourses, enrollment] }));
        try { api.post(`/courses/${courseId}/enroll`); } catch (_) { }
    },

    completeModule: (courseId, moduleId) => {
        set(s => {
            const completed = s.completedModules[courseId] || [];
            if (completed.includes(moduleId)) return s;
            const newCompleted = [...completed, moduleId];
            const course = s.allCourses.find(c => c._id === courseId);
            const total = course?.modules?.length || 1;
            const pct = Math.round((newCompleted.length / total) * 100);
            const updatedEnrolled = s.enrolledCourses.map(e => {
                const id = e.course?._id || e._id;
                if (id === courseId) return { ...e, completionPercent: pct };
                return e;
            });
            return { completedModules: { ...s.completedModules, [courseId]: newCompleted }, enrolledCourses: updatedEnrolled };
        });
    },

    toggleModuleLock: (courseId, moduleId, isLocked) => {
        set(s => ({
            allCourses: s.allCourses.map(c =>
                c._id === courseId ? { ...c, modules: c.modules.map(m => m._id === moduleId ? { ...m, isLocked } : m) } : c
            )
        }));
    },

    createCourse: (course) => set(s => ({ allCourses: [{ ...course, _id: `c${Date.now()}`, enrolledCount: 0, modules: course.modules || [] }, ...s.allCourses] })),
    updateCourse: (id, update) => set(s => ({ allCourses: s.allCourses.map(c => c._id === id ? { ...c, ...update } : c) })),
    deleteCourse: (id) => set(s => ({ allCourses: s.allCourses.filter(c => c._id !== id) })),
}));
