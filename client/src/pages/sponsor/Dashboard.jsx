import { useSponsorStore } from '../../store/sponsorStore';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const RISK_BADGE = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green', None: 'badge-gray' };

export default function SponsorDashboard() {
    const { sponsorships, dashboardStats } = useSponsorStore();

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Students Funded', data: [1, 1, 2, 2, 3, 3], borderColor: '#FFD600', backgroundColor: 'rgba(255,214,0,0.1)', fill: true, tension: 0.4, pointRadius: 4 }]
    };

    const barData = {
        labels: sponsorships.map(s => s.student?.name?.split(' ')[0] || 'Student'),
        datasets: [{ label: 'Completion %', data: sponsorships.map(s => s.student?.avgCompletion || 0), backgroundColor: sponsorships.map(s => s.student?.risk === 'High' ? '#ef4444' : s.student?.risk === 'Medium' ? '#f59e0b' : '#22c55e'), borderRadius: 8 }]
    };

    const totalFunded = sponsorships.reduce((a, s) => a + s.amount, 0);
    const atRisk = sponsorships.filter(s => s.student?.risk === 'High' || s.student?.risk === 'Medium').length;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">🏛️ Sponsor Overview</h1>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Students Funded', value: sponsorships.length, icon: '👥', color: 'from-blue-400 to-blue-500' },
                    { label: 'Total Invested', value: `₹${totalFunded.toLocaleString()}`, icon: '💰', color: 'from-yellow-400 to-yellow-500' },
                    { label: 'At Risk', value: atRisk, icon: '⚠️', color: 'from-red-400 to-red-500' },
                    { label: 'Cost/Success', value: `₹${dashboardStats.costPerSuccess}`, icon: '📊', color: 'from-green-400 to-green-500' },
                ].map((k, i) => (
                    <div key={i} className="kpi-card">
                        <div className={`w-10 h-10 bg-gradient-to-br ${k.color} rounded-xl flex items-center justify-center text-lg mb-2`}>{k.icon}</div>
                        <div className="kpi-value text-xl">{k.value}</div>
                        <div className="kpi-label">{k.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">📈 Funding Growth</h3>
                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} height={140} />
                </div>
                <div className="card">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">📊 Student Completion</h3>
                    <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} height={140} />
                </div>
            </div>

            {/* Sponsorship Table */}
            <div className="card">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">📋 Sponsored Students</h3>
                <div className="space-y-3">
                    {sponsorships.map(sp => (
                        <div key={sp._id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center font-bold text-black shrink-0">{sp.student?.name?.[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{sp.student?.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="progress-track h-1.5 w-20 dark:h-1.5"><div className="progress-bar h-1.5" style={{ width: `${sp.student?.avgCompletion || 0}%` }} /></div>
                                    <span className="text-xs text-gray-400">{sp.student?.avgCompletion || 0}%</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">₹{sp.amount}</p>
                                <span className={RISK_BADGE[sp.student?.risk] || 'badge-gray'}>{sp.student?.risk} Risk</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
