import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { openSearch } from '../common/GlobalSearch';

export default function Navbar({ collapsed, onToggle }) {
    const { user, toggleTheme, theme, markNotificationsRead } = useAuthStore();
    const [showNotif, setShowNotif] = useState(false);
    const notifications = user?.notifications || [];
    const unread = notifications.filter(n => !n.read).length;

    const getLevel = (xp = 0) => {
        if (xp >= 6000) return { label: 'Master', color: 'text-purple-600' };
        if (xp >= 3000) return { label: 'Expert', color: 'text-red-600' };
        if (xp >= 1500) return { label: 'Advanced', color: 'text-blue-600' };
        if (xp >= 500) return { label: 'Intermediate', color: 'text-green-600' };
        return { label: 'Beginner', color: 'text-gray-600' };
    };
    const lvl = getLevel(user?.xp);

    return (
        <header className="glass-header h-16 flex items-center justify-between px-4 gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={onToggle} className="btn-ghost p-2 rounded-xl" aria-label="Toggle sidebar">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <button onClick={openSearch} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                    <span>🔍</span><span>Search...</span><kbd className="ml-2 text-xs bg-white dark:bg-dark-600 px-1.5 py-0.5 rounded border border-gray-200 dark:border-dark-500">⌘K</kbd>
                </button>
            </div>
            <div className="flex items-center gap-2">
                {user?.role === 'student' && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <span className="text-primary-600 text-lg">⚡</span>
                        <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{user?.xp || 0} XP</span>
                        <span className={`text-xs font-semibold ${lvl.color}`}>{lvl.label}</span>
                        {user?.streak > 0 && <span className="text-xs font-semibold text-orange-500">🔥 {user.streak}</span>}
                    </div>
                )}
                {/* Search mobile */}
                <button onClick={openSearch} className="sm:hidden btn-ghost p-2 rounded-xl">🔍</button>
                {/* Theme toggle */}
                <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                {/* Notifications */}
                <div className="relative">
                    <button onClick={() => { setShowNotif(o => !o); markNotificationsRead(); }} className="btn-ghost p-2 rounded-xl relative">
                        🔔
                        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
                    </button>
                    {showNotif && (
                        <div className="absolute right-0 top-12 w-72 card shadow-2xl z-50 p-0 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700 font-semibold text-sm text-gray-700 dark:text-gray-200">Notifications</div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? <p className="text-center text-gray-400 py-6 text-sm">No notifications</p> :
                                    notifications.slice(0, 10).map((n, i) => (
                                        <div key={i} className={`px-4 py-3 text-sm border-b border-gray-50 dark:border-dark-800 ${n.read ? 'opacity-60' : 'font-medium'}`}>
                                            <p className="text-gray-700 dark:text-gray-300">{n.message}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
                <div onClick={() => setShowNotif(false)} className={showNotif ? 'fixed inset-0 z-40' : 'hidden'} />
            </div>
        </header>
    );
}
