import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/common/ToastManager';
import { DEMO_QUIZZES } from '../../store/courseStore';
import api from '../../api/axios';

const FALLBACK_QUIZ = {
    title: 'General Knowledge Quiz', passingScore: 70, xpReward: 40, timeLimit: 10,
    questions: [
        { _id: 'gq1', question: 'What does API stand for?', options: [{ text: 'Application Programming Interface', isCorrect: true }, { text: 'Automated Program Installer', isCorrect: false }, { text: 'App Process Integration', isCorrect: false }, { text: 'All Program Instructions', isCorrect: false }], explanation: 'API = Application Programming Interface — a way for software to communicate.' },
        { _id: 'gq2', question: 'What does HTTP stand for?', options: [{ text: 'HyperText Transfer Protocol', isCorrect: true }, { text: 'High Tech Transfer Process', isCorrect: false }, { text: 'Hyper Terminal Transfer Path', isCorrect: false }, { text: 'Host Transfer Type Protocol', isCorrect: false }], explanation: 'HTTP is the foundation of data communication on the Web.' },
        { _id: 'gq3', question: 'What is a "bug" in software?', options: [{ text: 'A security feature', isCorrect: false }, { text: 'An unexpected error or flaw in code', isCorrect: true }, { text: 'A type of virus', isCorrect: false }, { text: 'A software update', isCorrect: false }], explanation: 'A bug is any unintended behavior in a program.' },
    ]
};

export default function QuizAttemptPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { addXP } = useAuthStore();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
            const demoQuiz = DEMO_QUIZZES[quizId] ? { ...DEMO_QUIZZES[quizId], _id: quizId } : { ...FALLBACK_QUIZ, _id: quizId };

            if (stored?.state?.token === 'demo-token') {
                setQuiz(demoQuiz);
                setTimeLeft(demoQuiz.timeLimit * 60);
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get(`/quizzes/${quizId}`);
                setQuiz(data.data);
                setTimeLeft(data.data.timeLimit * 60);
            } catch {
                setQuiz(demoQuiz);
                setTimeLeft(demoQuiz.timeLimit * 60);
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [quizId]);


    // Countdown timer
    useEffect(() => {
        if (timeLeft === null || submitted) return;
        if (timeLeft <= 0) { handleSubmit(true); return; }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, submitted]);

    const handleSelect = (questionId, optionIdx) => {
        if (submitted) return;
        setAnswers(a => ({ ...a, [questionId]: optionIdx }));
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (submitting) return;
        const answeredCount = Object.keys(answers).length;
        if (!autoSubmit && answeredCount < (quiz?.questions?.length || 0)) {
            toast(`Please answer all questions (${answeredCount}/${quiz.questions.length} answered)`, 'error');
            return;
        }
        setSubmitting(true);
        clearTimeout(timerRef.current);

        const answerPayload = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption }));

        const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
        if (stored?.state?.token === 'demo-token') {
            // Compute result locally
            let correct = 0;
            const results = quiz.questions.map(q => {
                const selected = answers[q._id];
                const isCorrect = selected !== undefined && q.options[selected]?.isCorrect;
                if (isCorrect) correct++;
                return { questionId: q._id, selectedOption: selected ?? -1, isCorrect, explanation: q.explanation };
            });
            const score = Math.round((correct / quiz.questions.length) * 100);
            const passed = score >= quiz.passingScore;
            const xpEarned = passed ? quiz.xpReward : 0;
            if (xpEarned > 0) addXP(xpEarned);
            setResult({ score, passed, correct, total: quiz.questions.length, xpEarned, results });
            setSubmitted(true);
            setSubmitting(false);
            return;
        }

        try {
            const { data } = await api.post('/quizzes/submit', { quizId: quiz._id, answers: answerPayload });
            setResult(data.data);
            if (data.data.xpEarned > 0) addXP(data.data.xpEarned);
        } catch {
            toast('Could not submit quiz. Showing local result.', 'error');
            let correct = 0;
            const results = quiz.questions.map(q => {
                const selected = answers[q._id];
                const isCorrect = selected !== undefined && q.options[selected]?.isCorrect;
                if (isCorrect) correct++;
                return { questionId: q._id, selectedOption: selected ?? -1, isCorrect, explanation: q.explanation };
            });
            const score = Math.round((correct / quiz.questions.length) * 100);
            setResult({ score, passed: score >= quiz.passingScore, correct, total: quiz.questions.length, xpEarned: score >= quiz.passingScore ? quiz.xpReward : 0, results });
        }
        setSubmitted(true);
        setSubmitting(false);
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!quiz) return (
        <div className="max-w-xl mx-auto text-center py-20">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Quiz not found</h2>
            <button onClick={() => navigate(-1)} className="btn-secondary mt-4">← Go Back</button>
        </div>
    );

    // ---- RESULT SCREEN ----
    if (submitted && result) {
        const { score, passed, correct, total, xpEarned, results } = result;
        return (
            <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
                <div className={`card text-center p-8 border-2 ${passed ? 'border-green-400' : 'border-red-400'}`}>
                    <div className="text-6xl mb-4">{passed ? '🏆' : '📚'}</div>
                    <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{quiz.title}</p>

                    <div className="flex justify-center gap-6 mb-6">
                        <div className="text-center">
                            <div className={`text-5xl font-black ${passed ? 'text-green-500' : 'text-red-500'}`}>{score}%</div>
                            <div className="text-sm text-gray-400 mt-1">Your Score</div>
                        </div>
                        <div className="w-px bg-gray-200 dark:bg-dark-600" />
                        <div className="text-center">
                            <div className="text-5xl font-black text-gray-700 dark:text-gray-200">{correct}/{total}</div>
                            <div className="text-sm text-gray-400 mt-1">Correct</div>
                        </div>
                        {xpEarned > 0 && (
                            <>
                                <div className="w-px bg-gray-200 dark:bg-dark-600" />
                                <div className="text-center">
                                    <div className="text-5xl font-black text-primary-500">+{xpEarned}</div>
                                    <div className="text-sm text-gray-400 mt-1">XP Earned</div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 mb-4">
                        <div className={`h-3 rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${score}%` }} />
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {passed ? '✅ Passed!' : `❌ Need ${quiz.passingScore}% to pass`}
                    </div>
                </div>

                {/* Per-question review */}
                <div className="space-y-4">
                    <h2 className="font-bold text-gray-800 dark:text-white">📋 Answer Review</h2>
                    {quiz.questions.map((q, qi) => {
                        const r = results?.find(r => String(r.questionId) === String(q._id));
                        return (
                            <div key={q._id} className={`card border-l-4 ${r?.isCorrect ? 'border-l-green-500' : 'border-l-red-400'}`}>
                                <div className="flex items-start gap-3">
                                    <span className={`text-lg ${r?.isCorrect ? '✅' : '❌'}`}>{r?.isCorrect ? '✅' : '❌'}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm mb-2">{qi + 1}. {q.question}</p>
                                        {q.options.map((opt, oi) => (
                                            <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg mb-1 ${opt.isCorrect ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold' : r?.selectedOption === oi && !opt.isCorrect ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 line-through' : 'text-gray-500'}`}>
                                                {opt.isCorrect && '✓ '}{opt.text}
                                            </div>
                                        ))}
                                        {q.explanation && <p className="text-xs text-gray-400 mt-2 italic">💡 {q.explanation}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate('/student/profile')} className="btn-secondary">👤 View Profile</button>
                    <button onClick={() => navigate('/student/dashboard')} className="btn-primary">🏠 Dashboard</button>
                </div>
            </div>
        );
    }

    // ---- QUIZ TAKING SCREEN ----
    const answeredCount = Object.keys(answers).length;
    const timerWarning = timeLeft !== null && timeLeft < 60;

    return (
        <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
            {/* Header */}
            <div className="card">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white">{quiz.title}</h1>
                        <p className="text-sm text-gray-400">{answeredCount}/{quiz.questions.length} answered · {quiz.passingScore}% to pass · +{quiz.xpReward} XP</p>
                    </div>
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timerWarning ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-200'}`}>
                            ⏱️ {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="h-2 bg-primary-500 rounded-full transition-all" style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
                </div>
            </div>

            {/* Questions */}
            {quiz.questions.map((q, qi) => {
                const selected = answers[q._id];
                return (
                    <div key={q._id} className="card space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-bold flex items-center justify-center flex-shrink-0">{qi + 1}</span>
                            <p className="font-semibold text-gray-800 dark:text-white pt-1">{q.question}</p>
                        </div>
                        <div className="space-y-2 ml-11">
                            {q.options.map((opt, oi) => (
                                <button key={oi} type="button" onClick={() => handleSelect(q._id, oi)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 text-sm font-medium ${selected === oi ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-dark-700'}`}>
                                    <span className="inline-flex w-6 h-6 rounded-full border-2 items-center justify-center mr-3 flex-shrink-0 text-xs font-bold border-current">
                                        {String.fromCharCode(65 + oi)}
                                    </span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Submit */}
            <div className="card flex items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {answeredCount < quiz.questions.length
                        ? `${quiz.questions.length - answeredCount} question(s) remaining`
                        : '✅ All questions answered!'}
                </p>
                <button onClick={() => handleSubmit(false)} disabled={submitting}
                    className="btn-primary px-8 py-3 text-base">
                    {submitting ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '🚀 Submit Quiz'}
                </button>
            </div>
        </div>
    );
}
