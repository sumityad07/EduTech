import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/common/ToastManager';

function VideoModal({ module, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="w-full max-w-2xl animate-bounce-in" onClick={e => e.stopPropagation()}>
                <div className="card p-0 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-700">
                        <h3 className="font-bold text-gray-800 dark:text-white">{module.title}</h3>
                        <button onClick={onClose} className="btn-ghost p-1">✕</button>
                    </div>
                    <div className="aspect-video bg-black">
                        <iframe src={module.videoUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    </div>
                    <div className="p-4"><p className="text-sm text-gray-500">⏱ {module.duration} minutes • +{module.xpReward} XP</p></div>
                </div>
            </div>
        </div>
    );
}

export default function MyCourses() {
    const { enrolledCourses, completedModules, completeModule, allCourses } = useCourseStore();
    const { addXP } = useAuthStore();
    const navigate = useNavigate();
    const [videoMod, setVideoMod] = useState(null);
    const [expanded, setExpanded] = useState({});

    const handleComplete = (courseId, mod) => {
        const done = (completedModules[courseId] || []).includes(mod._id);
        if (done) return;
        completeModule(courseId, mod._id);
        addXP(mod.xpReward || 20);
        toast(`+${mod.xpReward} XP! Module "${mod.title}" completed 🎉`, 'success');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Courses</h1>
                <span className="badge-yellow">{enrolledCourses.length} enrolled</span>
            </div>

            {enrolledCourses.length === 0 && (
                <div className="card text-center py-16">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">No courses yet</h3>
                    <p className="text-gray-400 text-sm mb-4">Start your learning journey today</p>
                    <a href="/student/explore" className="btn-primary inline-flex">Explore Courses →</a>
                </div>
            )}

            {enrolledCourses.map(e => {
                const course = e.course || allCourses.find(c => c._id === (e.course?._id || e.courseId)) || e;
                const courseId = course._id;
                const done = completedModules[courseId] || [];
                const total = course.modules?.length || 1;
                const pct = Math.round((done.length / total) * 100);
                const isOpen = expanded[courseId];

                return (
                    <div key={e._id || courseId} className="card">
                        <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(s => ({ ...s, [courseId]: !isOpen }))}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="font-bold text-gray-900 dark:text-white">{course.title}</h2>
                                    <span className={`badge ${pct === 100 ? 'badge-green' : 'badge-yellow'}`}>{pct === 100 ? '✅ Done' : `${pct}%`}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{course.instructor} • {course.level}</p>
                                <div className="progress-track h-2"><div className="progress-bar h-2" style={{ width: `${pct}%` }} /></div>
                                <p className="text-xs text-gray-400 mt-1">{done.length}/{total} modules complete</p>
                            </div>
                            <span className="text-gray-400 text-lg">{isOpen ? '▲' : '▼'}</span>
                        </div>

                        {isOpen && (
                            <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-dark-700 pt-4">
                                {(course.modules || []).map(mod => {
                                    const isCompleted = done.includes(mod._id);
                                    const isLocked = mod.isLocked && !isCompleted;
                                    return (
                                        <div key={mod._id} className={`flex items-center gap-3 p-3 rounded-xl border ${isLocked ? 'opacity-50 border-gray-100 dark:border-dark-700' : 'border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700'} transition-colors`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-600'}`}>
                                                {isCompleted ? '✅' : isLocked ? '🔒' : { video: '🎥', text: '📄', project: '🛠️', quiz: '📝' }[mod.type] || '📄'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{mod.title}</p>
                                                <p className="text-xs text-gray-400">{mod.duration}m • +{mod.xpReward} XP</p>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {mod.type === 'video' && !isLocked && (
                                                    <button onClick={() => setVideoMod(mod)} className="btn-secondary btn-sm">▶ Watch</button>
                                                )}
                                                {(mod.quizId || mod.type === 'quiz') && !isLocked && (
                                                    <button onClick={() => navigate(`/student/quiz/${mod.quizId || mod._id}`)} className="btn-primary btn-sm">📝 Quiz</button>
                                                )}
                                                {mod.type !== 'quiz' && !mod.quizId && !isLocked && !isCompleted && (
                                                    <button onClick={() => handleComplete(courseId, mod)} className="btn-primary btn-sm">Mark Done</button>
                                                )}
                                                {mod.type !== 'quiz' && mod.quizId && !isLocked && !isCompleted && (
                                                    <button onClick={() => handleComplete(courseId, mod)} className="btn-ghost btn-sm text-xs">✓ Mark Done</button>
                                                )}
                                                {isCompleted && <span className="badge-green">Done</span>}
                                                {isLocked && <span className="text-xs text-gray-400 flex items-center gap-1" title="Complete previous modules to unlock">🔒 Locked</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {videoMod && <VideoModal module={videoMod} onClose={() => setVideoMod(null)} />}
        </div>
    );
}
