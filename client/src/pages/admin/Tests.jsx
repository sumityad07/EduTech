import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import { toast } from '../../components/common/ToastManager';
import api from '../../api/axios';

export default function AdminTests() {
    const { allCourses, toggleModuleLock } = useCourseStore();
    const navigate = useNavigate();
    const [selCourse, setSelCourse] = useState(allCourses[0]?._id || '');
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('results'); // 'results' | 'locks'

    const course = allCourses.find(c => c._id === selCourse);

    useEffect(() => {
        api.get('/admin/quiz-attempts').then(({ data }) => setAttempts(data.data || [])).catch(() => {
            // Demo data fallback
            setAttempts([
                { _id: 'a1', student: { name: 'Alice Johnson', email: 'alice@student.com' }, quiz: { title: 'JavaScript Fundamentals Quiz' }, score: 80, passed: true, attemptedAt: new Date(Date.now() - 86400000).toISOString() },
                { _id: 'a2', student: { name: 'Bob Smith', email: 'bob@student.com' }, quiz: { title: 'CSS Mastery Quiz' }, score: 55, passed: false, attemptedAt: new Date(Date.now() - 172800000).toISOString() },
                { _id: 'a3', student: { name: 'Alice Johnson', email: 'alice@student.com' }, quiz: { title: 'React Hooks Quiz' }, score: 100, passed: true, attemptedAt: new Date(Date.now() - 259200000).toISOString() },
                { _id: 'a4', student: { name: 'Carol Lee', email: 'carol@student.com' }, quiz: { title: 'Python Basics Quiz' }, score: 70, passed: true, attemptedAt: new Date(Date.now() - 345600000).toISOString() },
            ]);
        }).finally(() => setLoading(false));
    }, []);

    const passRate = attempts.length > 0 ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100) : 0;
    const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">🧪 Test Results & Module Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View student quiz attempts and manage module locks</p>
                </div>
                <button onClick={() => navigate('/admin/quizzes')} className="btn-primary">📝 Manage Quizzes</button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Attempts', value: attempts.length, icon: '📋' },
                    { label: 'Pass Rate', value: `${passRate}%`, icon: '✅' },
                    { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯' },
                ].map(s => (
                    <div key={s.label} className="card text-center">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-xl font-black text-gray-900 dark:text-white">{s.value}</div>
                        <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 max-w-xs">
                <button onClick={() => setTab('results')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'results' ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
                    📊 Results
                </button>
                <button onClick={() => setTab('locks')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'locks' ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
                    🔒 Module Locks
                </button>
            </div>

            {/* Results Tab */}
            {tab === 'results' && (
                <div className="card p-0 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-gray-400 mt-2 text-sm">Loading attempts...</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                                    <th className="table-header text-left px-4 py-3">Student</th>
                                    <th className="table-header text-left px-4 py-3 hidden md:table-cell">Quiz</th>
                                    <th className="table-header text-center px-4 py-3">Score</th>
                                    <th className="table-header text-center px-4 py-3">Status</th>
                                    <th className="table-header text-right px-4 py-3 hidden sm:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                                {attempts.map(a => (
                                    <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{a.student?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">{a.student?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">{a.quiz?.title || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold text-sm ${a.score >= 80 ? 'text-green-500' : a.score >= 60 ? 'text-yellow-500' : 'text-red-400'}`}>
                                                {a.score}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`badge text-xs ${a.passed ? 'badge-green' : 'badge-red'}`}>
                                                {a.passed ? '✅ Passed' : '❌ Failed'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">
                                            {new Date(a.attemptedAt || a.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && attempts.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-4xl mb-2">📋</div>
                            <p>No quiz attempts yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Module Lock Tab */}
            {tab === 'locks' && (
                <div className="space-y-4">
                    <div className="card">
                        <label className="label">Select Course to Manage</label>
                        <select className="select-input max-w-sm" value={selCourse} onChange={e => setSelCourse(e.target.value)}>
                            {allCourses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    {course && (
                        <div className="card">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">🔒 Module Lock Controls — {course.title}</h3>
                            <div className="space-y-3">
                                {(course.modules || []).map(mod => (
                                    <div key={mod._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{{ video: '🎥', text: '📄', project: '🛠️', quiz: '📝' }[mod.type] || '📄'}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{mod.title}</p>
                                                <p className="text-xs text-gray-400">{mod.type} • {mod.duration}m • +{mod.xpReward} XP</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`badge ${mod.isLocked ? 'badge-red' : 'badge-green'}`}>{mod.isLocked ? '🔒 Locked' : '🔓 Open'}</span>
                                            <button onClick={() => {
                                                toggleModuleLock(course._id, mod._id, !mod.isLocked);
                                                toast(`Module "${mod.title}" ${mod.isLocked ? 'unlocked' : 'locked'}`, 'info');
                                            }} className={mod.isLocked ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}>
                                                {mod.isLocked ? 'Unlock' : 'Lock'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!course.modules || course.modules.length === 0) && (
                                    <p className="text-gray-400 text-sm text-center py-4">No modules in this course yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
