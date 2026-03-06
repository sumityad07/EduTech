import { useState, useMemo } from 'react';
import { useCourseStore } from '../../store/courseStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/common/ToastManager';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORIES = ['All', 'Development', 'Data Science', 'Design', 'DevOps', 'Business'];
const SORTS = ['Most Popular', 'Newest', 'Shortest'];

export default function Explore() {
    const { allCourses, enrolledCourses, enroll } = useCourseStore();
    const { addNotification } = useAuthStore();
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('All');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('Most Popular');

    const isEnrolled = (id) => enrolledCourses.some(e => (e.course?._id || e._id || e.courseId) === id);

    const filtered = useMemo(() => {
        let c = allCourses.filter(c => c.isPublished);
        if (search) c = c.filter(x => x.title.toLowerCase().includes(search.toLowerCase()) || x.description.toLowerCase().includes(search.toLowerCase()));
        if (level !== 'All') c = c.filter(x => x.level === level);
        if (category !== 'All') c = c.filter(x => x.category === category);
        if (sort === 'Most Popular') c = [...c].sort((a, b) => b.enrolledCount - a.enrolledCount);
        else if (sort === 'Shortest') c = [...c].sort((a, b) => a.duration - b.duration);
        return c;
    }, [allCourses, search, level, category, sort]);

    const handleEnroll = (course) => {
        if (isEnrolled(course._id)) { toast('Already enrolled!', 'warning'); return; }
        enroll(course._id);
        addNotification(`You enrolled in "${course.title}" 🎉`);
        toast(`Enrolled in ${course.title}! 🚀`, 'success');
    };

    const levelColor = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-yellow', Expert: 'badge-red' };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">🔍 Explore Courses</h1>

            {/* Filters */}
            <div className="card flex flex-wrap gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="input flex-1 min-w-48" />
                <select value={level} onChange={e => setLevel(e.target.value)} className="select-input w-40">{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
                <select value={category} onChange={e => setCategory(e.target.value)} className="select-input w-44">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                <select value={sort} onChange={e => setSort(e.target.value)} className="select-input w-36">{SORTS.map(s => <option key={s}>{s}</option>)}</select>
            </div>

            <p className="text-sm text-gray-500">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(course => {
                    const enrolled = isEnrolled(course._id);
                    return (
                        <div key={course._id} className="card-hover flex flex-col">
                            <div className="h-32 bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-dark-700 dark:to-dark-600 rounded-xl mb-4 flex items-center justify-center text-4xl">
                                {course.category === 'Development' ? '💻' : course.category === 'Data Science' ? '📊' : course.category === 'Design' ? '🎨' : course.category === 'DevOps' ? '⚙️' : '📚'}
                            </div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={levelColor[course.level] || 'badge-gray'}>{course.level}</span>
                                <span className="badge-gray">{course.category}</span>
                                <span className="badge-gray">⏱ {course.duration}h</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{course.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-1">{course.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-xs text-gray-400"><span>👤 {course.instructor}</span><br /><span>📥 {course.enrolledCount} enrolled</span></div>
                                <button onClick={() => handleEnroll(course)} disabled={enrolled}
                                    className={enrolled ? 'btn-secondary btn-sm opacity-60 cursor-not-allowed' : 'btn-primary btn-sm'}>
                                    {enrolled ? '✅ Enrolled' : 'Enroll Now'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="card text-center py-16"><div className="text-4xl mb-2">🔍</div><p className="text-gray-500">No courses match your filters.</p></div>
            )}
        </div>
    );
}
