import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import { useAdminStore } from '../../store/adminStore';

let openSearchFn = null;
export const openSearch = () => { if (openSearchFn) openSearchFn(); };

export default function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { allCourses } = useCourseStore();
    const { students } = useAdminStore();
    const navigate = useNavigate();

    useEffect(() => { openSearchFn = () => setOpen(true); }, []);

    useEffect(() => {
        const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); } if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const results = query.length > 1 ? [
        ...allCourses.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).map(c => ({ type: 'Course', label: c.title, action: () => { navigate('/student/explore'); setOpen(false); } })),
        ...students.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(s => ({ type: 'Student', label: s.name, action: () => { navigate('/admin/students'); setOpen(false); } })),
    ].slice(0, 8) : [];

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="w-full max-w-xl animate-bounce-in" onClick={e => e.stopPropagation()}>
                <div className="card p-2">
                    <div className="flex items-center gap-3 px-3 py-1 border-b border-gray-100 dark:border-dark-700 mb-2">
                        <span className="text-gray-400">🔍</span>
                        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses, students..." className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white text-base py-2" />
                        <kbd className="badge-gray text-xs px-2 py-1">ESC</kbd>
                    </div>
                    {results.length === 0 && query.length > 1 && <p className="text-center text-gray-400 py-6 text-sm">No results found</p>}
                    {results.map((r, i) => (
                        <button key={i} onClick={r.action} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left group transition-colors">
                            <span className="badge-gray text-xs">{r.type}</span>
                            <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400">{r.label}</span>
                            <span className="text-xs text-gray-300">→</span>
                        </button>
                    ))}
                    {query.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">Type to search courses and students...</p>}
                </div>
            </div>
        </div>
    );
}
