import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import api from '../../api/axios';

const LEVEL_COLORS = {
    Beginner: 'text-gray-500 bg-gray-100 dark:bg-dark-700',
    Intermediate: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    Advanced: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    Expert: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
    Master: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
};

const ACHIEVEMENTS = [
    { id: 'first_step', icon: '🌱', title: 'First Step', desc: 'Joined EduFlow', xpReq: 0 },
    { id: 'starter', icon: '⚡', title: 'Quick Starter', desc: 'Earned 100+ XP', xpReq: 100 },
    { id: 'learner', icon: '📚', title: 'Active Learner', desc: 'Earned 500+ XP', xpReq: 500 },
    { id: 'intermediate', icon: '🎯', title: 'Sharpshooter', desc: 'Reached Intermediate', xpReq: 500 },
    { id: 'advanced', icon: '🔥', title: 'On Fire', desc: 'Reached Advanced', xpReq: 1500 },
    { id: 'expert', icon: '💎', title: 'Expert Learner', desc: 'Reached Expert', xpReq: 3000 },
    { id: 'master', icon: '👑', title: 'Master', desc: 'Reached Master level', xpReq: 6000 },
    { id: 'streak_3', icon: '📅', title: 'Consistent', desc: '3-day streak', xpReq: 0 },
];

const XP_LEVELS = [
    { level: 'Beginner', min: 0, max: 500 },
    { level: 'Intermediate', min: 500, max: 1500 },
    { level: 'Advanced', min: 1500, max: 3000 },
    { level: 'Expert', min: 3000, max: 6000 },
    { level: 'Master', min: 6000, max: 9000 },
];

function getXPProgress(xp) {
    for (const l of XP_LEVELS) {
        if (xp < l.max) {
            const pct = Math.min(100, Math.round(((xp - l.min) / (l.max - l.min)) * 100));
            return { level: l.level, pct, xpToNext: l.max - xp, nextLevel: XP_LEVELS[XP_LEVELS.indexOf(l) + 1]?.level };
        }
    }
    return { level: 'Master', pct: 100, xpToNext: 0, nextLevel: null };
}

export default function StudentProfile() {
    const { user } = useAuthStore();
    const { enrolledCourses } = useCourseStore();
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loadingAttempts, setLoadingAttempts] = useState(true);

    const xp = user?.xp || 0;
    const streak = user?.streak || 0;
    const { level, pct, xpToNext, nextLevel } = getXPProgress(xp);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
        if (stored?.state?.token === 'demo-token') {
            setAttempts([
                { _id: 'da1', quiz: { title: 'JavaScript Fundamentals Quiz', passingScore: 70, xpReward: 50 }, score: 80, passed: true, attemptedAt: new Date(Date.now() - 86400000).toISOString() },
                { _id: 'da2', quiz: { title: 'CSS Mastery Quiz', passingScore: 70, xpReward: 30 }, score: 60, passed: false, attemptedAt: new Date(Date.now() - 172800000).toISOString() },
                { _id: 'da3', quiz: { title: 'React Hooks Quiz', passingScore: 70, xpReward: 50 }, score: 100, passed: true, attemptedAt: new Date(Date.now() - 259200000).toISOString() },
            ]);
            setLoadingAttempts(false);
            return;
        }
        api.get('/quizzes/my-attempts')
            .then(({ data }) => setAttempts(data.data || []))
            .catch(() => setAttempts([]))
            .finally(() => setLoadingAttempts(false));
    }, []);

    const passedCount = attempts.filter(a => a.passed).length;
    const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0;
    const achievements = ACHIEVEMENTS.filter(a => {
        if (a.id === 'streak_3') return streak >= 3;
        return xp >= a.xpReq;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-800 dark:to-dark-700 border border-primary-200 dark:border-primary-900">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-4xl font-black text-black shadow-lg glow-yellow">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${LEVEL_COLORS[level] || LEVEL_COLORS.Beginner}`}>
                                🎖️ {level}
                            </span>
                            <span className="badge-yellow">⚡ {xp} XP</span>
                            <span className="badge-blue">🔥 {streak} day streak</span>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="mt-4 max-w-sm">
                            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                <span>{level}</span>
                                {nextLevel && <span>{xpToNext} XP to {nextLevel}</span>}
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5">
                                <div className="h-2.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{pct}% to next level</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: '📚' },
                    { label: 'Quizzes Attempted', value: attempts.length, icon: '📝' },
                    { label: 'Quizzes Passed', value: passedCount, icon: '✅' },
                    { label: 'Avg Quiz Score', value: `${avgScore}%`, icon: '🎯' },
                ].map(s => (
                    <div key={s.label} className="card text-center">
                        <div className="text-3xl mb-1">{s.icon}</div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Enrolled Courses */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">📚 Enrolled Courses</h2>
                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">📖</div>
                        <p>No courses enrolled yet.</p>
                        <button onClick={() => navigate('/student/explore')} className="btn-primary mt-3">Explore Courses</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {enrolledCourses.map(e => {
                            const course = e.course || e;
                            const pct = e.completionPercent || 0;
                            return (
                                <div key={e._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-dark-800">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xl flex-shrink-0">🎓</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{course.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                                                <div className="h-2 bg-primary-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className={`text-xs font-bold flex-shrink-0 ${pct === 100 ? 'text-green-500' : 'text-gray-400'}`}>{pct}%</span>
                                        </div>
                                    </div>
                                    {pct === 100 && <span className="badge-green text-xs">✅ Complete</span>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quiz History */}
            <div className="card space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">🧠 Quiz History</h2>
                    {attempts.length > 0 && <span className="badge-gray">{attempts.length} attempts</span>}
                </div>

                {loadingAttempts ? (
                    <div className="text-center py-6">
                        <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : attempts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">📝</div>
                        <p>No quiz attempts yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-dark-700">
                                    <th className="pb-2 font-medium">Quiz</th>
                                    <th className="pb-2 font-medium text-center">Score</th>
                                    <th className="pb-2 font-medium text-center">Status</th>
                                    <th className="pb-2 font-medium text-right hidden sm:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                                {attempts.map(a => (
                                    <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                        <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {a.quiz?.title || 'Unknown Quiz'}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`font-bold text-sm ${a.score >= 80 ? 'text-green-500' : a.score >= 60 ? 'text-yellow-500' : 'text-red-400'}`}>
                                                {a.score}%
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`badge text-xs ${a.passed ? 'badge-green' : 'badge-red'}`}>
                                                {a.passed ? '✅ Passed' : '❌ Failed'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right text-xs text-gray-400 hidden sm:table-cell">
                                            {new Date(a.attemptedAt || a.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Achievements */}
            <div className="card space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">🏆 Achievements ({achievements.length}/{ACHIEVEMENTS.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ACHIEVEMENTS.map(a => {
                        const earned = achievements.find(ea => ea.id === a.id);
                        return (
                            <div key={a.id} className={`text-center p-4 rounded-xl border-2 transition-all ${earned ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-dark-700 opacity-40 grayscale'}`}>
                                <div className="text-3xl mb-1">{a.icon}</div>
                                <p className="text-xs font-bold text-gray-800 dark:text-white">{a.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
