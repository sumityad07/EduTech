import { useMemo } from 'react';
import { useCourseStore } from '../../store/courseStore';

const TOOLS = [
    { title: 'Resume Builder', icon: '📄', desc: 'Create an ATS-friendly resume', minCompletion: 0 },
    { title: 'LinkedIn Profile Review', icon: '💼', desc: 'Optimize your LinkedIn presence', minCompletion: 30 },
    { title: 'Interview Prep Guide', icon: '🎤', desc: 'Ace technical and HR interviews', minCompletion: 50 },
    { title: 'Job Board Access', icon: '🔍', desc: 'Access exclusive job listings', minCompletion: 60 },
    { title: 'Mentorship Sessions', icon: '🤝', desc: 'Connect with industry mentors', minCompletion: 70 },
    { title: 'Portfolio Review', icon: '🖥️', desc: 'Get expert feedback on your projects', minCompletion: 80 },
    { title: 'Career Coaching', icon: '🏆', desc: 'Personalized 1-on-1 career coaching', minCompletion: 90 },
];

export default function CareerTools() {
    const { enrolledCourses } = useCourseStore();
    const avgCompletion = useMemo(() => {
        if (!enrolledCourses.length) return 0;
        return Math.round(enrolledCourses.reduce((a, e) => a + (e.completionPercent || 0), 0) / enrolledCourses.length);
    }, [enrolledCourses]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">💼 Career Tools</h1>
                <p className="text-gray-500 text-sm mt-1">Complete more courses to unlock additional career resources</p>
            </div>

            {/* Progress Banner */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Your Avg Course Completion</h3>
                        <p className="text-sm text-gray-500">Increases as you complete more modules</p>
                    </div>
                    <div className="text-3xl font-black text-primary-600">{avgCompletion}%</div>
                </div>
                <div className="progress-track h-3">
                    <div className="progress-bar h-3" style={{ width: `${avgCompletion}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    {[0, 30, 50, 70, 90].map(v => <span key={v}>{v}%</span>)}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOOLS.map(tool => {
                    const unlocked = avgCompletion >= tool.minCompletion;
                    return (
                        <div key={tool.title} className={`card flex items-start gap-4 ${!unlocked ? 'opacity-60' : 'card-hover'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${unlocked ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-dark-700'}`}>{tool.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{tool.title}</h3>
                                    {!unlocked && <span className="badge-gray text-xs">🔒 {tool.minCompletion}%</span>}
                                    {unlocked && <span className="badge-green text-xs">✅ Unlocked</span>}
                                </div>
                                <p className="text-sm text-gray-500">{tool.desc}</p>
                                {unlocked ? (
                                    <button className="btn-primary btn-sm mt-2" onClick={() => alert(`${tool.title} launched!`)}>Open Tool →</button>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-2">Reach {tool.minCompletion}% avg completion to unlock</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
