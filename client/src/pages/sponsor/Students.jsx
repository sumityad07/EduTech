import { useState, useMemo } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useSponsorStore } from '../../store/sponsorStore';
import { toast } from '../../components/common/ToastManager';

const RISK_BADGE = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green', None: 'badge-gray' };
const RISK_COLOR = { High: 'border-l-red-500', Medium: 'border-l-yellow-400', Low: 'border-l-green-500', None: 'border-l-gray-200' };

export default function SponsorStudents() {
    const { students } = useAdminStore();
    const { sponsorStudent, sponsorships } = useSponsorStore();
    const [search, setSearch] = useState('');
    const [atRiskOnly, setAtRiskOnly] = useState(false);
    const [riskFilter, setRiskFilter] = useState('All');
    const [selected, setSelected] = useState([]);
    const [sponsorModal, setSponsorModal] = useState(null);
    const [amount, setAmount] = useState(300);

    const enriched = useMemo(() => students.map(s => {
        const risk = s.avgCompletion < 30 ? 'High' : s.avgCompletion < 50 ? 'Medium' : s.avgCompletion < 60 ? 'Low' : 'None';
        const isAtRisk = s.avgCompletion < 50 || s.streak < 3;
        const isSponsored = sponsorships.some(sp => sp.student?._id === s._id);
        return { ...s, risk, isAtRisk, isSponsored };
    }), [students, sponsorships]);

    const filtered = useMemo(() => {
        let s = enriched;
        if (search) s = s.filter(st => st.name.toLowerCase().includes(search.toLowerCase()) || st.email.toLowerCase().includes(search.toLowerCase()));
        if (atRiskOnly) s = s.filter(st => st.isAtRisk);
        if (riskFilter !== 'All') s = s.filter(st => st.risk === riskFilter);
        return s;
    }, [enriched, search, atRiskOnly, riskFilter]);

    const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    const bulkEncourage = () => { toast(`Encouragement sent to ${selected.length} student(s)! 💪`, 'success'); setSelected([]); };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">👥 Student Directory</h1>
                {selected.length > 0 && (
                    <button onClick={bulkEncourage} className="btn-primary animate-bounce-in">💪 Encourage ({selected.length})</button>
                )}
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="input flex-1 min-w-48" />
                <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="select-input w-36">
                    {['All', 'High', 'Medium', 'Low', 'None'].map(r => <option key={r}>{r} Risk</option>)}
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={atRiskOnly} onChange={e => setAtRiskOnly(e.target.checked)} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">At Risk Only</span>
                </label>
                <span className="badge-gray self-center">{filtered.length} students</span>
            </div>

            {/* Risk Legend */}
            <div className="flex flex-wrap gap-3">
                {[['High', 'Completion < 30%', 'badge-red'], ['Medium', 'Completion < 50%', 'badge-yellow'], ['Low', 'Completion < 60%', 'badge-green'], ['None', 'On track', 'badge-gray']].map(([r, d, b]) => (
                    <div key={r} className="flex items-center gap-2 text-xs text-gray-500"><span className={b}>{r}</span><span>{d}</span></div>
                ))}
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(s => (
                    <div key={s._id} className={`card border-l-4 ${RISK_COLOR[s.risk] || 'border-l-gray-200'} relative ${selected.includes(s._id) ? 'ring-2 ring-primary-400' : ''}`}
                        onClick={() => toggleSelect(s._id)}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center font-bold text-black shrink-0">{s.name[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{s.name}</p>
                                <p className="text-xs text-gray-400 truncate">{s.email}</p>
                            </div>
                            <span className={RISK_BADGE[s.risk] || 'badge-gray'}>{s.risk}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg py-1.5"><p className="text-xs text-gray-400">XP</p><p className="text-sm font-bold">{s.xp}</p></div>
                            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg py-1.5"><p className="text-xs text-gray-400">Streak</p><p className="text-sm font-bold">{s.streak}d</p></div>
                            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg py-1.5"><p className="text-xs text-gray-400">Done</p><p className="text-sm font-bold">{s.avgCompletion}%</p></div>
                        </div>
                        <div className="progress-track h-1.5 mb-3"><div className={`progress-bar h-1.5 ${s.risk === 'High' ? '!bg-red-500' : s.risk === 'Medium' ? '!bg-yellow-400' : ''}`} style={{ width: `${s.avgCompletion}%` }} /></div>
                        <div className="flex gap-2">
                            <button onClick={e => { e.stopPropagation(); setSponsorModal(s); }} disabled={s.isSponsored} className={`flex-1 btn-sm ${s.isSponsored ? 'btn-secondary opacity-60 cursor-not-allowed' : 'btn-primary'}`}>
                                {s.isSponsored ? '✅ Sponsored' : '💰 Sponsor'}
                            </button>
                            <button onClick={e => { e.stopPropagation(); toast(`Encouragement sent to ${s.name}!`, 'success'); }} className="btn-secondary btn-sm flex-1">💌 Encourage</button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <div className="card text-center py-12"><div className="text-4xl mb-2">👥</div><p className="text-gray-500">No students match your filters.</p></div>}

            {/* Sponsor Modal */}
            {sponsorModal && (
                <div className="modal-overlay" onClick={() => setSponsorModal(null)}>
                    <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">💰 Sponsor {sponsorModal.name}</h3>
                        <div>
                            <label className="label">Sponsorship Amount (₹)</label>
                            <input type="number" className="input" value={amount} onChange={e => setAmount(Number(e.target.value))} min={100} step={100} />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setSponsorModal(null)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={() => { sponsorStudent(sponsorModal._id, amount, ''); toast(`${sponsorModal.name} sponsored with ₹${amount}! 🎉`, 'success'); setSponsorModal(null); }} className="btn-primary flex-1">Confirm Sponsorship</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
