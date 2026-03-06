import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const studentLinks = [
    { to: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/student/courses', icon: '📚', label: 'My Courses' },
    { to: '/student/explore', icon: '🔍', label: 'Explore' },
    { to: '/student/career', icon: '💼', label: 'Career Tools' },
    { to: '/student/analytics', icon: '📊', label: 'Analytics' },
    { to: '/student/profile', icon: '👤', label: 'My Profile' },
];

const adminLinks = [
    { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/admin/courses', icon: '🎓', label: 'Courses' },
    { to: '/admin/quizzes', icon: '📝', label: 'Quizzes' },
    { to: '/admin/students', icon: '👥', label: 'Students' },
    { to: '/admin/tests', icon: '🧪', label: 'Test Results' },
];

const sponsorLinks = [
    { to: '/sponsor/dashboard', icon: '🏠', label: 'Overview' },
    { to: '/sponsor/students', icon: '👥', label: 'Student Directory' },
];

const linkMap = { student: studentLinks, admin: adminLinks, sponsor: sponsorLinks };
const roleColors = { student: 'from-primary-500 to-primary-600', admin: 'from-gray-800 to-gray-900 dark:from-dark-700 dark:to-dark-900', sponsor: 'from-blue-600 to-blue-800' };
const roleLabels = { student: 'Student Portal', admin: 'Admin Portal', sponsor: 'Sponsor Portal' };

export default function Sidebar({ role, collapsed, onToggle }) {
    const { user, logout } = useAuthStore();
    const links = linkMap[role] || [];

    return (
        <aside className={`flex flex-col h-full bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-700 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Brand */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-dark-700 bg-gradient-to-r ${roleColors[role]}`}>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg font-black text-white shrink-0">E</div>
                {!collapsed && <div>
                    <p className="font-black text-white text-sm">EduFlow</p>
                    <p className="text-xs text-white/70">{roleLabels[role]}</p>
                </div>}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
                {links.map(link => (
                    <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? link.label : ''}>
                        <span className="text-lg shrink-0">{link.icon}</span>
                        {!collapsed && <span>{link.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User Footer */}
            <div className="border-t border-gray-100 dark:border-dark-700 p-3">
                {!collapsed && (
                    <div className="flex items-center gap-2 px-2 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black font-bold text-sm shrink-0">{user?.name?.[0] || '?'}</div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={logout} className={`w-full btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center px-2' : ''}`}>
                    <span>🚪</span>{!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
