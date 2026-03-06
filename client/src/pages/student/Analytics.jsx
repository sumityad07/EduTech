import { useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { Radar, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Generate fake heatmap data (12 months × 7 days)
const generateHeatmap = () => Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
        const isBusy = day >= 1 && day <= 4 && week % 3 !== 0;
        return isBusy ? Math.floor(Math.random() * 4 + 1) : Math.floor(Math.random() * 2);
    })
);

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const INTENSITY_COLORS = ['bg-gray-100 dark:bg-dark-700', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600'];

export default function Analytics() {
    const { user } = useAuthStore();
    const { enrolledCourses } = useCourseStore();
    const heatmap = useMemo(() => generateHeatmap(), []);
    const avgCompletion = useMemo(() => enrolledCourses.length ? Math.round(enrolledCourses.reduce((a, e) => a + (e.completionPercent || 0), 0) / enrolledCourses.length) : 0, [enrolledCourses]);

    const radarData = {
        labels: ['Consistency', 'Quiz Performance', 'Completion', 'Engagement', 'XP Growth', 'Streak'],
        datasets: [{
            label: 'Your Stats', data: [
                Math.min(100, (user?.streak || 0) * 3),
                75,
                avgCompletion,
                Math.min(100, enrolledCourses.length * 20),
                Math.min(100, (user?.xp || 0) / 60),
                Math.min(100, (user?.streak || 0) * 3.3),
            ], backgroundColor: 'rgba(255,214,0,0.2)', borderColor: '#FFD600', pointBackgroundColor: '#FFD600', pointRadius: 4
        }]
    };

    const barData = {
        labels: enrolledCourses.map(e => (e.course?.title || e.title || 'Course').slice(0, 12) + '...'),
        datasets: [{ label: 'Completion %', data: enrolledCourses.map(e => e.completionPercent || 0), backgroundColor: enrolledCourses.map((_, i) => i % 2 === 0 ? '#FFD600' : '#FF8F00'), borderRadius: 8 }]
    };

    const xpMilestones = [
        { label: 'First Login', xp: 10, achieved: (user?.xp || 0) >= 10 },
        { label: 'Intermediate', xp: 500, achieved: (user?.xp || 0) >= 500 },
        { label: 'Advanced', xp: 1500, achieved: (user?.xp || 0) >= 1500 },
        { label: 'Expert', xp: 3000, achieved: (user?.xp || 0) >= 3000 },
        { label: 'Master', xp: 6000, achieved: (user?.xp || 0) >= 6000 },
    ];

    const handleDownload = () => {
        const rows = [['Metric', 'Value'], ['Total XP', user?.xp || 0], ['Streak', user?.streak || 0], ['Level', user?.level], ['Avg Completion', avgCompletion + '%'], ['Courses Enrolled', enrolledCourses.length]];
        const csv = rows.map(r => r.join(',')).join('\n');
        const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'visin-report.csv'; a.click();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">📊 Analytics</h1>
                <button onClick={handleDownload} className="btn-secondary btn-sm">📥 Download Report</button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Completion', value: `${avgCompletion}%`, icon: '✅' },
                    { label: 'Total XP', value: user?.xp || 0, icon: '⚡' },
                    { label: 'Best Streak', value: `${user?.streak || 0} days`, icon: '🔥' },
                    { label: 'Level', value: user?.level || 'Beginner', icon: '🏆' },
                ].map((k, i) => (
                    <div key={i} className="card text-center">
                        <div className="text-2xl mb-1">{k.icon}</div>
                        <div className="kpi-value text-xl">{k.value}</div>
                        <div className="kpi-label">{k.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">🎯 Skills Radar</h3>
                    <Radar data={radarData} options={{ responsive: true, scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 }, grid: { color: 'rgba(0,0,0,0.05)' } } }, plugins: { legend: { display: false } } }} />
                </div>

                {/* Bar Chart */}
                <div className="card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">📚 Course Completion</h3>
                    {enrolledCourses.length > 0
                        ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
                        : <div className="flex items-center justify-center h-40 text-gray-400">Enroll in courses to see data</div>}
                </div>
            </div>

            {/* XP Milestone Timeline */}
            <div className="card">
                <h3 className="font-bold text-gray-800 dark:text-white mb-6">⚡ XP Milestone Timeline</h3>
                <div className="relative">
                    <div className="absolute left-0 top-4 right-0 h-1 bg-gray-100 dark:bg-dark-700 rounded" />
                    <div className="flex justify-between relative">
                        {xpMilestones.map((m, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${m.achieved ? 'bg-primary-500 text-black shadow-lg glow-yellow' : 'bg-gray-200 dark:bg-dark-700 text-gray-400'}`}>
                                    {m.achieved ? '✓' : i + 1}
                                </div>
                                <div className="text-center mt-1">
                                    <p className={`text-xs font-bold ${m.achieved ? 'text-primary-600' : 'text-gray-400'}`}>{m.label}</p>
                                    <p className="text-xs text-gray-400">{m.xp} XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Heatmap */}
            <div className="card overflow-x-auto">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">🗓️ Activity Heatmap (52 weeks)</h3>
                <div className="flex gap-0.5">
                    <div className="flex flex-col gap-0.5 mr-1">
                        {DAYS.map(d => <div key={d} className="w-3 h-3 text-[8px] text-gray-400 flex items-center justify-center">{d}</div>)}
                    </div>
                    {heatmap.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-0.5">
                            {week.map((val, di) => (
                                <div key={di} className={`w-3 h-3 rounded-sm ${INTENSITY_COLORS[Math.min(val, 5)]} transition-all hover:opacity-80`} title={`${val} activities`} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-3 justify-end">
                    <span className="text-xs text-gray-400">Less</span>
                    {INTENSITY_COLORS.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
                    <span className="text-xs text-gray-400">More</span>
                </div>
            </div>
        </div>
    );
}
