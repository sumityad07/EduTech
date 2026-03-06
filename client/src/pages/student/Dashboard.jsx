import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LEVEL_XP = [0, 500, 1500, 3000, 6000, Infinity];
const LEVEL_NAMES = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

function XPProgressBar({ xp }) {
    const idx = LEVEL_NAMES.findIndex((_, i) => xp < LEVEL_XP[i + 1]);
    const lvlIdx = idx === -1 ? 4 : idx;
    const cur = LEVEL_XP[lvlIdx], next = LEVEL_XP[lvlIdx + 1] === Infinity ? LEVEL_XP[lvlIdx] : LEVEL_XP[lvlIdx + 1];
    const pct = next === cur ? 100 : Math.min(100, Math.round(((xp - cur) / (next - cur)) * 100));
    return (
        <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{LEVEL_NAMES[lvlIdx]}</span>
                <span>{lvlIdx < 4 ? `${xp}/${next} XP` : 'Max Level'}</span>
            </div>
            <div className="progress-track h-2"><div className="progress-bar h-2" style={{ width: `${pct}%` }} /></div>
        </div>
    );
}

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const { enrolledCourses, allCourses, fetchCourses, fetchEnrolled } = useCourseStore();
    const [counter, setCounter] = useState(0);
    const [activity] = useState(() => Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], xp: Math.floor(Math.random() * 80 + 10) })));

    useEffect(() => { fetchCourses(); fetchEnrolled(); }, []);
    useEffect(() => { let t = setInterval(() => setCounter(c => c < (user?.xp || 0) ? c + Math.ceil((user?.xp || 0) / 40) : user?.xp || 0), 30); return () => clearInterval(t); }, [user?.xp]);

    const avgCompletion = enrolledCourses.length ? Math.round(enrolledCourses.reduce((a, e) => a + (e.completionPercent || 0), 0) / enrolledCourses.length) : 0;

    const lineData = { labels: activity.map(a => a.day), datasets: [{ label: 'XP Earned', data: activity.map(a => a.xp), fill: true, borderColor: '#FFD600', backgroundColor: 'rgba(255,214,0,0.1)', tension: 0.4, pointBackgroundColor: '#FFD600', pointRadius: 4 }] };
    const lineOpts = { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw} XP` } } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } };

    const getLevelColor = (l) => ({ Beginner: 'badge-gray', Intermediate: 'badge-green', Advanced: 'badge-blue', Expert: 'badge-red', Master: 'badge-yellow' })[l] || 'badge-gray';

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 p-6 text-black">
                <div className="absolute right-0 top-0 w-48 h-full opacity-10">
                    <svg viewBox="0 0 200 200" fill="white"><circle cx="150" cy="50" r="80" /><circle cx="180" cy="150" r="60" /></svg>
                </div>
                <div className="relative">
                    <p className="text-sm font-semibold opacity-80 mb-1">👋 Good learning,</p>
                    <h1 className="text-2xl font-black mb-3">{user?.name || 'Student'}!</h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-black/10 rounded-xl px-4 py-2 text-center">
                            <div className="text-2xl font-black">⚡ {Math.min(counter, user?.xp || 0)}</div>
                            <div className="text-xs opacity-80">Total XP</div>
                        </div>
                        <div className="bg-black/10 rounded-xl px-4 py-2 text-center">
                            <div className="text-2xl font-black">🔥 {user?.streak || 0}</div>
                            <div className="text-xs opacity-80">Day Streak</div>
                        </div>
                        <div className="bg-black/10 rounded-xl px-4 py-2 text-center">
                            <div className="text-2xl font-black">📚 {enrolledCourses.length}</div>
                            <div className="text-xs opacity-80">Courses</div>
                        </div>
                    </div>
                    <div className="mt-4 max-w-sm">
                        <XPProgressBar xp={user?.xp || 0} />
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Enrolled Courses', value: enrolledCourses.length, icon: '📚', color: 'from-yellow-400 to-yellow-500' },
                    { label: 'Avg Completion', value: `${avgCompletion}%`, icon: '✅', color: 'from-green-400 to-green-500' },
                    { label: 'Current Level', value: user?.level || 'Beginner', icon: '🏆', color: 'from-blue-400 to-blue-500' },
                    { label: 'Total XP', value: `${user?.xp || 0} XP`, icon: '⚡', color: 'from-primary-400 to-primary-600' },
                ].map((k, i) => (
                    <div key={i} className="card">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center text-lg mb-2`}>{k.icon}</div>
                        <div className="kpi-value text-2xl">{k.value}</div>
                        <div className="kpi-label">{k.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* XP Chart */}
                <div className="lg:col-span-2 card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">📈 Weekly XP Activity</h3>
                    <Line data={lineData} options={lineOpts} height={120} />
                </div>

                {/* Enrolled Courses */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 dark:text-white">My Courses</h3>
                        <Link to="/student/courses" className="text-xs text-primary-600 font-semibold hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-3">
                        {enrolledCourses.slice(0, 3).map(e => {
                            const course = e.course || e;
                            return (
                                <div key={e._id || e.course?._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-lg shrink-0">📖</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{course.title}</p>
                                        <div className="progress-track h-1.5 mt-1"><div className="progress-bar h-1.5" style={{ width: `${e.completionPercent || 0}%` }} /></div>
                                    </div>
                                    <span className="text-xs font-bold text-primary-600">{e.completionPercent || 0}%</span>
                                </div>
                            );
                        })}
                        {enrolledCourses.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No courses yet. <Link to="/student/explore" className="text-primary-600 font-semibold">Explore →</Link></p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
