import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useCourseStore } from '../../store/courseStore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const heatmapData = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 5)));
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const INTENSITY = ['bg-gray-100 dark:bg-dark-700', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500'];

export default function AdminDashboard() {
    const { dashboardStats, alerts, markAlertRead, markAllRead } = useAdminStore();
    const { allCourses } = useCourseStore();
    const [alertFilter, setAlertFilter] = useState('all');

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            { label: 'Enrollments', data: [12, 28, 35, 58, 72, 89, 105], borderColor: '#FFD600', backgroundColor: 'rgba(255,214,0,0.1)', fill: true, tension: 0.4 },
            { label: 'Completions', data: [4, 10, 18, 30, 45, 62, 80], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
            { label: 'Active Users', data: [8, 20, 28, 44, 60, 78, 95], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
        ]
    };

    const filteredAlerts = alertFilter === 'all' ? alerts : alertFilter === 'unread' ? alerts.filter(a => !a.read) : alerts.filter(a => a.type === alertFilter);
    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">🏠 Admin Dashboard</h1>
                <span className="badge-yellow">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: dashboardStats.totalStudents, icon: '👥', change: '+12%', color: 'from-yellow-400 to-yellow-500' },
                    { label: 'Total Courses', value: allCourses.length, icon: '🎓', change: '+2', color: 'from-blue-400 to-blue-500' },
                    { label: 'Total Enrollments', value: dashboardStats.totalEnrollments, icon: '📥', change: '+24', color: 'from-green-400 to-green-500' },
                    { label: 'Avg Completion', value: `${dashboardStats.avgCompletion}%`, icon: '✅', change: '+5%', color: 'from-purple-400 to-purple-500' },
                ].map((k, i) => (
                    <div key={i} className="kpi-card">
                        <div className={`w-10 h-10 bg-gradient-to-br ${k.color} rounded-xl flex items-center justify-center text-lg mb-2`}>{k.icon}</div>
                        <div className="kpi-value">{k.value}</div>
                        <div className="kpi-label">{k.label}</div>
                        <div className="text-xs text-green-500 font-semibold mt-1">↑ {k.change} this month</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">📈 Platform Metrics (2024)</h3>
                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} height={120} />
                </div>

                {/* Alerts */}
                <div className="card flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 dark:text-white">🚨 Alerts {unreadCount > 0 && <span className="ml-1 badge-red">{unreadCount}</span>}</h3>
                        <div className="flex gap-2">
                            <select value={alertFilter} onChange={e => setAlertFilter(e.target.value)} className="text-xs border border-gray-200 dark:border-dark-600 rounded-lg px-2 py-1 bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200">
                                <option value="all">All</option><option value="unread">Unread</option><option value="warning">Warning</option><option value="info">Info</option>
                            </select>
                            <button onClick={markAllRead} className="text-xs text-primary-600 font-semibold hover:underline">Mark all read</button>
                        </div>
                    </div>
                    <div className="space-y-2 flex-1 overflow-y-auto max-h-52">
                        {filteredAlerts.map(a => (
                            <div key={a.id} onClick={() => markAlertRead(a.id)} className={`flex items-start gap-2 p-2.5 rounded-xl cursor-pointer transition-colors ${a.read ? 'opacity-60' : 'bg-orange-50 dark:bg-orange-900/20'} hover:bg-gray-50 dark:hover:bg-dark-700`}>
                                <span className="text-base shrink-0">{a.type === 'warning' ? '⚠️' : a.type === 'danger' ? '🔴' : 'ℹ️'}</span>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{a.message}</p>
                            </div>
                        ))}
                        {filteredAlerts.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No alerts</p>}
                    </div>
                </div>
            </div>

            {/* Heatmap 7x24 */}
            <div className="card overflow-x-auto">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">🔥 Activity Heatmap (Day × Hour)</h3>
                <div className="inline-flex gap-1">
                    <div className="flex flex-col gap-1 mr-1">{DAYS_SHORT.map(d => <div key={d} className="h-5 text-xs text-gray-400 flex items-center">{d}</div>)}</div>
                    {HOURS.map((h, hi) => (
                        <div key={hi} className="flex flex-col gap-1">
                            {heatmapData.map((row, di) => (
                                <div key={di} className={`w-5 h-5 rounded-sm ${INTENSITY[Math.min(row[hi], 4)]} transition-all hover:scale-110`} title={`${DAYS_SHORT[di]} ${h}: ${row[hi]} events`} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">{INTENSITY.map((c, i) => <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />)}</div>
            </div>
        </div>
    );
}
