import { useState, useEffect } from 'react';
import { useCourseStore } from '../../store/courseStore';
import { toast } from '../../components/common/ToastManager';
import api from '../../api/axios';

const EMPTY_MODULE = { title: '', type: 'video', videoUrl: '', content: '', duration: 10, order: 1, xpReward: 20, isLocked: false };
const EMPTY_COURSE = { title: '', description: '', category: 'Development', level: 'Beginner', duration: 10, instructor: '', thumbnail: '', isPublished: false, tags: [], modules: [] };

const CATEGORIES = ['Development', 'Data Science', 'Design', 'DevOps', 'Business', 'Marketing', 'Science'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function ModuleEditor({ modules, onChange }) {
    const [open, setOpen] = useState(null);

    const addModule = () => {
        const newMod = { ...EMPTY_MODULE, _id: `tmp-${Date.now()}`, order: modules.length + 1 };
        onChange([...modules, newMod]);
        setOpen(modules.length);
    };

    const updateMod = (idx, field, value) => {
        const updated = modules.map((m, i) => i === idx ? { ...m, [field]: value } : m);
        onChange(updated);
    };

    const removeMod = (idx) => {
        onChange(modules.filter((_, i) => i !== idx));
        setOpen(null);
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        try {
            // Support: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
            return match ? `https://www.youtube.com/embed/${match[1]}` : url;
        } catch { return url; }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="label mb-0">📦 Modules ({modules.length})</label>
                <button type="button" onClick={addModule} className="btn-secondary btn-sm text-xs">+ Add Module</button>
            </div>
            {modules.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm border border-dashed border-gray-200 dark:border-dark-600 rounded-xl">
                    No modules yet. Click "+ Add Module" to begin.
                </div>
            )}
            {modules.map((mod, idx) => (
                <div key={mod._id || idx} className="border border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden">
                    <button type="button"
                        onClick={() => setOpen(open === idx ? null : idx)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{mod.title || 'Untitled Module'}</span>
                            <span className="badge-gray text-xs">{mod.type}</span>
                            {mod.isLocked && <span className="text-xs">🔒</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeMod(idx); }} className="text-red-400 hover:text-red-600 text-xs px-2">✕</button>
                            <span className="text-gray-400 text-sm">{open === idx ? '▲' : '▼'}</span>
                        </div>
                    </button>

                    {open === idx && (
                        <div className="p-4 space-y-3 bg-white dark:bg-dark-900">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Module Title</label>
                                    <input className="input" value={mod.title} onChange={e => updateMod(idx, 'title', e.target.value)} placeholder="e.g. Introduction to React" />
                                </div>
                                <div>
                                    <label className="label">Type</label>
                                    <select className="select-input" value={mod.type} onChange={e => updateMod(idx, 'type', e.target.value)}>
                                        <option value="video">🎥 Video</option>
                                        <option value="text">📄 Text / Article</option>
                                        <option value="project">🛠️ Project</option>
                                        <option value="quiz">📝 Quiz</option>
                                    </select>
                                </div>
                            </div>

                            {mod.type === 'video' && (
                                <div>
                                    <label className="label">YouTube Video URL</label>
                                    <input className="input" value={mod.videoUrl} onChange={e => updateMod(idx, 'videoUrl', getYouTubeEmbedUrl(e.target.value))} placeholder="https://www.youtube.com/watch?v=..." />
                                    {mod.videoUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                                            <iframe src={mod.videoUrl} className="w-full h-full" allowFullScreen title="Preview" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {(mod.type === 'text' || mod.type === 'project') && (
                                <div>
                                    <label className="label">Content / Instructions</label>
                                    <textarea className="input resize-none" rows={3} value={mod.content} onChange={e => updateMod(idx, 'content', e.target.value)} placeholder="Module content or project brief..." />
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="label">Duration (min)</label>
                                    <input type="number" className="input" value={mod.duration} min={1} onChange={e => updateMod(idx, 'duration', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="label">XP Reward</label>
                                    <input type="number" className="input" value={mod.xpReward} min={0} onChange={e => updateMod(idx, 'xpReward', Number(e.target.value))} />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={mod.isLocked} onChange={e => updateMod(idx, 'isLocked', e.target.checked)} className="w-4 h-4 accent-primary-500" />
                                        <span className="label mb-0 text-sm">Locked 🔒</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function CourseModal({ course, onSave, onClose }) {
    const [form, setForm] = useState(course ? { ...course } : { ...EMPTY_COURSE, modules: [] });
    const [saving, setSaving] = useState(false);
    const isEdit = !!course?._id;

    const handleSave = async () => {
        if (!form.title.trim()) { toast('Title is required', 'error'); return; }
        if (!form.description.trim()) { toast('Description is required', 'error'); return; }
        setSaving(true);
        try {
            if (isEdit) {
                const { data } = await api.put(`/courses/${course._id}`, form);
                onSave(data.data, 'edit');
            } else {
                const { data } = await api.post('/courses', form);
                onSave(data.data, 'create');
            }
            toast(`Course ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            onClose();
        } catch (err) {
            // Fallback to local state if API fails (demo mode)
            onSave(form, isEdit ? 'edit' : 'create');
            toast(`Course ${isEdit ? 'updated' : 'created'}! (offline)`, 'info');
            onClose();
        }
        setSaving(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-700 sticky top-0 bg-white dark:bg-dark-800 z-10">
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">{isEdit ? '✏️ Edit Course' : '🎓 Create Course'}</h2>
                    <button onClick={onClose} className="btn-ghost p-1 text-lg">✕</button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="label">Course Title *</label>
                            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Full-Stack Web Development" />
                        </div>
                        <div>
                            <label className="label">Description *</label>
                            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief course description..." />
                        </div>
                        <div>
                            <label className="label">Thumbnail URL <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input className="input" value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Category</label>
                            <select className="select-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Level</label>
                            <select className="select-input" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                                {LEVELS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Instructor Name</label>
                            <input className="input" value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="e.g. Dr. Sarah Tech" />
                        </div>
                        <div>
                            <label className="label">Duration (hours)</label>
                            <input type="number" className="input" value={form.duration} min={1} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <div>
                        <label className="label">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                        <input className="input" value={(form.tags || []).join(', ')} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="React, Node.js, MongoDB" />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
                        <label htmlFor="pub" className="label mb-0 cursor-pointer">Publish course (visible to students)</label>
                    </div>

                    <hr className="border-gray-100 dark:border-dark-700" />

                    <ModuleEditor modules={form.modules || []} onChange={mods => setForm(f => ({ ...f, modules: mods }))} />
                </div>

                <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-dark-700 justify-end sticky bottom-0 bg-white dark:bg-dark-800">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={handleSave} disabled={saving || !form.title} className="btn-primary">
                        {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (isEdit ? '✅ Update Course' : '🚀 Create Course')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminCourses() {
    const { allCourses, updateCourse: storeUpdate, createCourse: storeCreate, deleteCourse: storeDelete, fetchCourses } = useCourseStore();
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    useEffect(() => { fetchCourses(); }, []);

    const filtered = allCourses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
        const matchLevel = !filterLevel || c.level === filterLevel;
        return matchSearch && matchLevel;
    });

    const handleSave = (courseData, mode) => {
        if (mode === 'edit') {
            storeUpdate(courseData._id || selected?._id, courseData);
        } else {
            storeCreate(courseData);
        }
    };

    const handleTogglePublish = async (c) => {
        const updated = { isPublished: !c.isPublished };
        try {
            await api.put(`/courses/${c._id}`, updated);
        } catch (_) { }
        storeUpdate(c._id, updated);
        toast(updated.isPublished ? '✅ Course published!' : '📝 Set to Draft', 'info');
    };

    const handleDelete = async (c) => {
        try { await api.delete(`/courses/${c._id}`); } catch (_) { }
        storeDelete(c._id);
        toast('Course deleted', 'error');
        setModal(null);
    };

    const levelBadge = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-yellow', Expert: 'badge-red' };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">🎓 Courses</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage all courses, modules, and YouTube lectures</p>
                </div>
                <button onClick={() => { setSelected(null); setModal('create'); }} className="btn-primary">
                    + Create Course
                </button>
            </div>

            {/* Filters */}
            <div className="card flex gap-3 flex-wrap">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="input flex-1 min-w-48" />
                <select className="select-input w-40" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                    <option value="">All Levels</option>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
                <span className="badge-gray self-center">{filtered.length} courses</span>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                            <th className="table-header text-left px-4 py-3">Course</th>
                            <th className="table-header text-left px-4 py-3 hidden md:table-cell">Category</th>
                            <th className="table-header text-left px-4 py-3 hidden lg:table-cell">Level</th>
                            <th className="table-header text-center px-4 py-3 hidden md:table-cell">Modules</th>
                            <th className="table-header text-center px-4 py-3 hidden md:table-cell">Enrolled</th>
                            <th className="table-header text-left px-4 py-3">Status</th>
                            <th className="table-header text-right px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                        {filtered.map(c => (
                            <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.title}</p>
                                    <p className="text-xs text-gray-400">{c.instructor || 'No instructor'}</p>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell"><span className="badge-gray">{c.category}</span></td>
                                <td className="px-4 py-3 hidden lg:table-cell"><span className={levelBadge[c.level] || 'badge-gray'}>{c.level}</span></td>
                                <td className="px-4 py-3 text-center hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">{c.modules?.length || 0}</td>
                                <td className="px-4 py-3 text-center hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">{c.enrolledCount || 0}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleTogglePublish(c)}
                                        className={`badge cursor-pointer transition-all hover:scale-105 ${c.isPublished ? 'badge-green' : 'badge-gray'}`}>
                                        {c.isPublished ? '✅ Published' : '📝 Draft'}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => { setSelected(c); setModal('edit'); }} className="btn-secondary btn-sm" title="Edit">✏️</button>
                                        <button onClick={() => { setSelected(c); setModal('delete'); }} className="btn-danger btn-sm" title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-2">📚</div>
                        <p>No courses found. Create your first course!</p>
                    </div>
                )}
            </div>

            {(modal === 'create' || modal === 'edit') && (
                <CourseModal course={modal === 'edit' ? selected : null} onSave={handleSave} onClose={() => setModal(null)} />
            )}

            {modal === 'delete' && selected && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-3">🗑️</div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete "{selected.title}"?</h3>
                        <p className="text-sm text-gray-500 mb-4">This will permanently remove the course and all its modules. This cannot be undone.</p>
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
