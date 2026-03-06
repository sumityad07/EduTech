import { create } from 'zustand';

const DEMO_SPONSORSHIPS = [
    { _id: 'sp1', student: { _id: 's1', name: 'Alice Johnson', email: 'alice@student.com', xp: 1620, streak: 7, avgCompletion: 72, risk: 'Low' }, amount: 500, startDate: '2024-01-15', isActive: true },
    { _id: 'sp2', student: { _id: 's2', name: 'Bob Smith', email: 'bob@student.com', xp: 480, streak: 2, avgCompletion: 25, risk: 'High' }, amount: 300, startDate: '2024-02-10', isActive: true },
    { _id: 'sp3', student: { _id: 's4', name: 'David Lee', email: 'david@student.com', xp: 150, streak: 0, avgCompletion: 10, risk: 'High' }, amount: 200, startDate: '2024-03-01', isActive: true },
];

export const useSponsorStore = create((set, get) => ({
    sponsorships: DEMO_SPONSORSHIPS,
    allStudents: [],
    dashboardStats: {
        totalFunded: 1000,
        totalStudents: 3,
        costPerSuccess: '500.00',
        completedCount: 2,
    },

    sponsorStudent: (studentId, amount, notes) => {
        const newSp = { _id: `sp${Date.now()}`, student: { _id: studentId, avgCompletion: 0, risk: 'None' }, amount, notes, startDate: new Date().toISOString(), isActive: true };
        set(s => ({ sponsorships: [...s.sponsorships, newSp], dashboardStats: { ...s.dashboardStats, totalStudents: s.dashboardStats.totalStudents + 1, totalFunded: s.dashboardStats.totalFunded + amount } }));
    },
}));
