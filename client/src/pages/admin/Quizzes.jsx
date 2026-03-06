import { useState, useEffect } from 'react';
import { toast } from '../../components/common/ToastManager';
import { useCourseStore } from '../../store/courseStore';
import api from '../../api/axios';

const EMPTY_QUESTION = { question: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], explanation: '' };
const EMPTY_QUIZ = { title: '', course: '', passingScore: 70, xpReward: 50, timeLimit: 30, questions: [] };

function QuestionEditor({ questions, onChange }) {
    const addQuestion = () => onChange([...questions, { ...EMPTY_QUESTION, _id: `q-${Date.now()}`, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
    const removeQuestion = (qi) => onChange(questions.filter((_, i) => i !== qi));
    const updateQ = (qi, field, value) => onChange(questions.map((q, i) => i === qi ? { ...q, [field]: value } : q));
    const updateOption = (qi, oi, field, value) => {
        onChange(questions.map((q, i) => {
            if (i !== qi) return q;
            const options = q.options.map((o, j) => {
                if (field === 'isCorrect') return { ...o, isCorrect: j === oi }; // radio behavior
                if (j !== oi) return o;
                return { ...o, [field]: value };
            });
            return { ...q, options };
        }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="label mb-0">❓ Questions ({questions.length})</label>
                <button type="button" onClick={addQuestion} className="btn-secondary btn-sm text-xs">+ Add Question</button>
            </div>
            {questions.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-200 dark:border-dark-600 rounded-xl text-gray-400 text-sm">
                    No questions yet. Add your first question!
                </div>
            )}
            {questions.map((q, qi) => (
                <div key={q._id || qi} className="border border-gray-200 dark:border-dark-600 rounded-xl p-4 space-y-3 bg-white dark:bg-dark-900">
                    <div className="flex items-start justify-between gap-3">
                        <span className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-1">{qi + 1}</span>
                        <input className="input flex-1" value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} placeholder="Enter your question here..." />
                        <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-2">✕</button>
                    </div>
                    <div className="ml-10 space-y-2">
                        <p className="text-xs text-gray-400 font-medium">Options (click radio to mark correct answer)</p>
                        {q.options.map((opt, oi) => (
                            <div key={oi} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${opt.isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-dark-600'}`}>
                                <input type="radio" name={`correct-${qi}-${q._id}`} checked={opt.isCorrect} onChange={() => updateOption(qi, oi, 'isCorrect', true)} className="w-4 h-4 accent-green-500 flex-shrink-0" title="Mark as correct" />
                                <input className="input bg-transparent border-0 flex-1 p-0 text-sm focus:ring-0" value={opt.text} onChange={e => updateOption(qi, oi, 'text', e.target.value)} placeholder={`Option ${oi + 1}`} />
                                {opt.isCorrect && <span className="text-green-500 text-xs font-bold flex-shrink-0">✓ Correct</span>}
                            </div>
                        ))}
                    </div>
                    <div className="ml-10">
                        <input className="input text-sm" value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} placeholder="Explanation (shown after attempt, optional)" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function QuizModal({ quiz, courses, onSave, onClose }) {
    const [form, setForm] = useState(quiz ? { ...quiz, course: quiz.course?._id || quiz.course || '' } : { ...EMPTY_QUIZ, questions: [] });
    const [saving, setSaving] = useState(false);
    const isEdit = !!quiz?._id;

    const handleSave = async () => {
        if (!form.title.trim()) { toast('Quiz title is required', 'error'); return; }
        if (form.questions.length === 0) { toast('Add at least one question', 'error'); return; }
        const hasIncomplete = form.questions.some(q => !q.question.trim() || q.options.every(o => !o.isCorrect));
        if (hasIncomplete) { toast('All questions must have text and a correct answer', 'error'); return; }
        setSaving(true);
        try {
            if (isEdit) {
                const { data } = await api.put(`/quizzes/${quiz._id}`, form);
                onSave(data.data, 'edit');
            } else {
                const { data } = await api.post('/quizzes', form);
                onSave(data.data, 'create');
            }
            toast(`Quiz ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            onClose();
        } catch (err) {
            toast(err.response?.data?.message || 'Saved offline', 'info');
            onSave({ ...form, _id: quiz?._id || `qz-${Date.now()}` }, isEdit ? 'edit' : 'create');
            onClose();
        }
        setSaving(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-700 sticky top-0 bg-white dark:bg-dark-800 z-10">
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">{isEdit ? '✏️ Edit Quiz' : '📝 Create Quiz'}</h2>
                    <button onClick={onClose} className="btn-ghost p-1 text-lg">✕</button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="label">Quiz Title *</label>
                        <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. JavaScript Fundamentals Quiz" />
                    </div>
                    <div>
                        <label className="label">Linked Course <span className="text-gray-400 font-normal">(optional)</span></label>
                        <select className="select-input" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))}>
                            <option value="">— Standalone Quiz —</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="label">Passing Score (%)</label>
                            <input type="number" className="input" value={form.passingScore} min={1} max={100} onChange={e => setForm(f => ({ ...f, passingScore: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <label className="label">XP Reward</label>
                            <input type="number" className="input" value={form.xpReward} min={0} onChange={e => setForm(f => ({ ...f, xpReward: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <label className="label">Time Limit (min)</label>
                            <input type="number" className="input" value={form.timeLimit} min={1} onChange={e => setForm(f => ({ ...f, timeLimit: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-dark-700" />
                    <QuestionEditor questions={form.questions || []} onChange={qs => setForm(f => ({ ...f, questions: qs }))} />
                </div>

                <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-dark-700 justify-end sticky bottom-0 bg-white dark:bg-dark-800">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary">
                        {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (isEdit ? '✅ Update Quiz' : '🚀 Create Quiz')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminQuizzes() {
    const { allCourses } = useCourseStore();
    const [quizzes, setQuizzes] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/quizzes/all').then(({ data }) => setQuizzes(data.data || [])).catch(() => setQuizzes([])).finally(() => setLoading(false));
    }, []);

    const filtered = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

    const handleSave = (data, mode) => {
        if (mode === 'edit') setQuizzes(qs => qs.map(q => q._id === data._id ? data : q));
        else setQuizzes(qs => [data, ...qs]);
    };

    const handleDelete = async (quiz) => {
        try { await api.delete(`/quizzes/${quiz._id}`); } catch (_) { }
        setQuizzes(qs => qs.filter(q => q._id !== quiz._id));
        toast('Quiz deleted', 'error');
        setModal(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">📝 Quizzes</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage quizzes with questions and scoring</p>
                </div>
                <button onClick={() => { setSelected(null); setModal('create'); }} className="btn-primary">+ Create Quiz</button>
            </div>

            <div className="card flex gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quizzes..." className="input flex-1" />
                <span className="badge-gray self-center">{filtered.length} quizzes</span>
            </div>

            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-400 mt-2 text-sm">Loading quizzes...</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                                <th className="table-header text-left px-4 py-3">Quiz</th>
                                <th className="table-header text-left px-4 py-3 hidden md:table-cell">Course</th>
                                <th className="table-header text-center px-4 py-3 hidden md:table-cell">Questions</th>
                                <th className="table-header text-center px-4 py-3 hidden lg:table-cell">Passing</th>
                                <th className="table-header text-center px-4 py-3 hidden lg:table-cell">XP</th>
                                <th className="table-header text-right px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                            {filtered.map(q => (
                                <tr key={q._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{q.title}</p>
                                        <p className="text-xs text-gray-400">⏱️ {q.timeLimit} min limit</p>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="badge-gray text-xs">{q.course?.title || 'Standalone'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{q.questions?.length || 0}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                                        <span className="badge-blue">{q.passingScore}%</span>
                                    </td>
                                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                                        <span className="badge-yellow">+{q.xpReward} XP</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => { setSelected(q); setModal('edit'); }} className="btn-secondary btn-sm">✏️</button>
                                            <button onClick={() => { setSelected(q); setModal('delete'); }} className="btn-danger btn-sm">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-2">📝</div>
                        <p>No quizzes yet. Create your first quiz!</p>
                    </div>
                )}
            </div>

            {(modal === 'create' || modal === 'edit') && (
                <QuizModal quiz={modal === 'edit' ? selected : null} courses={allCourses} onSave={handleSave} onClose={() => setModal(null)} />
            )}

            {modal === 'delete' && selected && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-3">🗑️</div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete "{selected.title}"?</h3>
                        <p className="text-sm text-gray-500 mb-4">All quiz attempts will be unlinked. This cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button onClick={() => handleDelete(selected)} className="btn-danger">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
