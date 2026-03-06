import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const getLevel = (xp) => {
    if (xp >= 6000) return 'Master';
    if (xp >= 3000) return 'Expert';
    if (xp >= 1500) return 'Advanced';
    if (xp >= 500) return 'Intermediate';
    return 'Beginner';
};

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            theme: 'light',

            login: async (email, password) => {
                const { data } = await api.post('/auth/login', { email, password });
                set({ user: data.user, token: data.token, isAuthenticated: true });
                api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                return data.user;
            },

            loginDemo: (role) => {
                const demos = {
                    admin: { id: 'demo-admin', name: 'Admin User', email: 'admin@visin.com', role: 'admin', xp: 0, streak: 0, level: 'Master', notifications: [{ message: 'Bob Smith is below 50% completion', read: false, id: 1 }, { message: 'Eva Chen completed a course! 🎉', read: true, id: 2 }] },
                    student: { id: 'demo-student', name: 'Alice Johnson', email: 'alice@student.com', role: 'student', xp: 1620, streak: 7, level: 'Advanced', notifications: [{ message: 'You earned +50 XP for passing the CSS Quiz! 🎉', read: false, id: 1 }, { message: 'New course available: DevOps & Cloud', read: false, id: 2 }] },
                    sponsor: { id: 'demo-sponsor', name: 'Sponsor Corp', email: 'sponsor@visin.com', role: 'sponsor', xp: 0, streak: 0, level: '-', notifications: [] },
                };
                set({ user: demos[role], token: 'demo-token', isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                delete api.defaults.headers.common['Authorization'];
                try { api.post('/auth/logout'); } catch (_) { }
            },

            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            },

            addXP: (amount) => set(s => ({ user: s.user ? { ...s.user, xp: (s.user.xp || 0) + amount, level: getLevel((s.user.xp || 0) + amount) } : s.user })),

            addNotification: (message) => set(s => ({
                user: s.user ? { ...s.user, notifications: [{ message, read: false, id: Date.now() }, ...(s.user.notifications || [])] } : s.user
            })),

            markNotificationsRead: () => set(s => ({
                user: s.user ? { ...s.user, notifications: (s.user.notifications || []).map(n => ({ ...n, read: true })) } : s.user
            })),
        }),
        { name: 'visin-auth', partialize: s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated, theme: s.theme }) }
    )
);
