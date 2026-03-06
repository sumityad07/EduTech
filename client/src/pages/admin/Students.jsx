import { useState, useMemo } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { toast } from '../../components/common/ToastManager';

const LEVEL_BADGE = { Beginner: 'badge-gray', Intermediate: 'badge-green', Advanced: 'badge-blue', Expert: 'badge-red', Master: 'badge-yellow' };

function StudentProfileModal({ student, onClose, onReset }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-700">
                    <h2 className="font-bold text-gray-900 dark:text-white">Student Profile</h2>
                    <button onClick={onClose} className="btn-ghost p-1">✕</button>
                </div>
                <div className="p-5 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-2xl font-black text-black">{student.name[0]}</div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.email}</p>
                            <span className={LEVEL_BADGE[student.level] || 'badge-gray'}>{student.level}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        {[['⚡ XP', student.xp], ['🔥 Streak', `${student.streak} days`], ['✅ Completion', `${student.avgCompletion}%`]].map(([l, v]) => (
                            <div key={l} className="bg-gray-50 dark:bg-dark-700 rounded-xl p-3"><p className="text-xs text-gray-500 mb-1">{l}</p><p className="font-bold text-gray-900 dark:text-white">{v}</p></div>
                        ))}
                    </div>
                    <div><h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Activity Log</h4>
                        <div className="space-y-1">
                            {['Enrolled in Full-Stack Dev', 'Completed HTML module (+20 XP)', 'Passed CSS Quiz (+50 XP)', 'Daily Login (+10 XP)'].map((a, i) => (
                                <p key={i} className="text-xs text-gray-500 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />{a}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-dark-700">
                    <button onClick={() => { toast(`Message sent to ${student.name}!`, 'info'); onClose(); }} className="btn-secondary flex-1">💬 Send Message</button>
                    <button onClick={() => { onReset(student._id); onClose(); }} className="btn-danger flex-1">🔄 Reset Progress</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminStudents() {
    const { students, resetStudentProgress } = useAdminStore();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => {
        let s = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
        if (sortBy === 'xp') s = [...s].sort((a, b) => b.xp - a.xp);
        else if (sortBy === 'completion') s = [...s].sort((a, b) => b.avgCompletion - a.avgCompletion);
        else s = [...s].sort((a, b) => a.name.localeCompare(b.name));
        return s;
    }, [students, search, sortBy]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">👥 Students</h1>
                <span className="badge-yellow">{students.length} total</span>
            </div>

            <div className="card flex gap-3 flex-wrap">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="input flex-1 min-w-48" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select-input w-40">
                    <option value="name">Sort: Name</option>
                    <option value="xp">Sort: XP</option>
                    <option value="completion">Sort: Completion</option>
                </select>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                            <th className="table-header text-left px-4 py-3">Student</th>
                            <th className="table-header text-left px-4 py-3">Level</th>
                            <th className="table-header text-left px-4 py-3">XP</th>
                            <th className="table-header text-left px-4 py-3">Completion</th>
                            <th className="table-header text-left px-4 py-3">Streak</th>
                            <th className="table-header text-left px-4 py-3">Quiz Score</th>
                            <th className="table-header text-right px-4 py-3">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                            {filtered.map(s => (
                                <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-sm font-bold shrink-0">{s.name[0]}</div>
                                            <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</p><p className="text-xs text-gray-400">{s.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className={LEVEL_BADGE[s.level] || 'badge-gray'}>{s.level}</span></td>
                                    <td className="px-4 py-3 text-sm font-semibold text-primary-600">⚡ {s.xp}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="progress-track h-1.5 w-16"><div className="progress-bar h-1.5" style={{ width: `${s.avgCompletion}%` }} /></div>
                                            <span className="text-xs text-gray-500">{s.avgCompletion}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-orange-500 font-semibold">{s.streak > 0 ? `🔥 ${s.streak}` : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{s.avgScore || '-'}%</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setSelected(s)} className="btn-secondary btn-sm">View Profile</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No students found</div>}
            </div>

            {selected && <StudentProfileModal student={selected} onClose={() => setSelected(null)} onReset={(id) => { resetStudentProgress(id); toast('Progress reset', 'success'); }} />}
        </div>
    );
}
