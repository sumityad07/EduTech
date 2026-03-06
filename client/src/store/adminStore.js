import { create } from 'zustand';

const DEMO_STUDENTS = [
    { _id: 's1', name: 'Alice Johnson', email: 'alice@student.com', xp: 1620, streak: 7, level: 'Advanced', avgCompletion: 72, avgScore: 85, enrollmentCount: 3, createdAt: '2024-01-15' },
    { _id: 's2', name: 'Bob Smith', email: 'bob@student.com', xp: 480, streak: 2, level: 'Beginner', avgCompletion: 25, avgScore: 55, enrollmentCount: 1, createdAt: '2024-02-10' },
    { _id: 's3', name: 'Carol White', email: 'carol@student.com', xp: 3200, streak: 15, level: 'Expert', avgCompletion: 98, avgScore: 92, enrollmentCount: 4, createdAt: '2023-11-05' },
    { _id: 's4', name: 'David Lee', email: 'david@student.com', xp: 150, streak: 0, level: 'Beginner', avgCompletion: 10, avgScore: 40, enrollmentCount: 1, createdAt: '2024-03-01' },
    { _id: 's5', name: 'Eva Chen', email: 'eva@student.com', xp: 6100, streak: 30, level: 'Master', avgCompletion: 100, avgScore: 97, enrollmentCount: 5, createdAt: '2023-09-20' },
    { _id: 's6', name: 'Frank Hall', email: 'frank@student.com', xp: 900, streak: 4, level: 'Intermediate', avgCompletion: 48, avgScore: 63, enrollmentCount: 2, createdAt: '2024-01-28' },
];

const DEMO_ALERTS = [
    { id: 'a1', type: 'warning', message: 'Bob Smith is below 50% completion in Full-Stack Development', read: false, createdAt: new Date().toISOString() },
    { id: 'a2', type: 'warning', message: 'David Lee has been inactive for 7+ days', read: false, createdAt: new Date().toISOString() },
    { id: 'a3', type: 'info', message: 'Eva Chen completed DevOps & Cloud Engineering with 100%', read: true, createdAt: new Date().toISOString() },
    { id: 'a4', type: 'danger', message: 'Quiz fail rate > 40% in JS Essentials section', read: false, createdAt: new Date().toISOString() },
];

export const useAdminStore = create((set, get) => ({
    students: DEMO_STUDENTS,
    alerts: DEMO_ALERTS,
    cohorts: [],
    dashboardStats: {
        totalStudents: 6,
        totalCourses: 4,
        totalEnrollments: 16,
        avgCompletion: 59,
    },

    markAlertRead: (id) => set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, read: true } : a) })),
    markAllRead: () => set(s => ({ alerts: s.alerts.map(a => ({ ...a, read: true })) })),

    resetStudentProgress: (id) => set(s => ({
        students: s.students.map(st => st._id === id ? { ...st, xp: 0, streak: 0, avgCompletion: 0 } : st)
    })),

    addAlert: (alert) => set(s => ({ alerts: [{ id: Date.now(), ...alert, read: false, createdAt: new Date().toISOString() }, ...s.alerts] })),
}));
