import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { toast } from '../../components/common/ToastManager';
import api from '../../api/axios';

export default function Login() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginDemo, isAuthenticated, user } = useAuthStore();
    const { seedDemo } = useCourseStore();
    const navigate = useNavigate();

    if (isAuthenticated && user) {
        navigate(`/${user.role}/dashboard`, { replace: true });
        return null;
    }

    const resetForm = () => { setName(''); setEmail(''); setPassword(''); setConfirm(''); };
    const switchMode = (m) => { setMode(m); resetForm(); };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const u = await login(email, password);
            toast(`Welcome back, ${u.name}! 👋`, 'success');
            navigate(`/${u.role}/dashboard`);
        } catch (err) {
            toast(err.response?.data?.message || 'Invalid email or password.', 'error');
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim()) { toast('Name is required', 'error'); return; }
        if (password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
        if (password !== confirm) { toast('Passwords do not match', 'error'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name: name.trim(), email: email.toLowerCase().trim(), password, role: 'student' });
            useAuthStore.setState({ user: data.user, token: data.token, isAuthenticated: true });
            toast(`Account created! Welcome, ${data.user.name}! 🎉`, 'success');
            navigate(`/${data.user.role}/dashboard`);
        } catch (err) {
            toast(err.response?.data?.message || 'Registration failed. Try a different email.', 'error');
        } finally { setLoading(false); }
    };

    const handleDemo = (role) => {
        loginDemo(role);
        if (role === 'student') seedDemo();
        toast(`Logged in as Demo ${role.charAt(0).toUpperCase() + role.slice(1)}! 🚀`, 'success');
        navigate(`/${role}/dashboard`);
    };

    const DEMOS = [
        { key: 'student', label: 'Student', icon: '👨‍🎓' },
        { key: 'admin', label: 'Admin', icon: '👩‍💼' },
        { key: 'sponsor', label: 'Sponsor', icon: '💼' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-300/30 dark:bg-primary-800/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg mb-4 glow-yellow">
                        <span className="text-3xl font-black text-black">E</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Edu<span className="text-gradient">Flow</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Learn. Grow. Excel.</p>
                </div>

                <div className="glass-card p-8">
                    {/* Toggle */}
                    <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
                        <button onClick={() => switchMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            🔐 Sign In
                        </button>
                        <button onClick={() => switchMode('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            ✨ Register
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="label">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input" />
                            </div>
                            <div className="text-xs text-gray-400 bg-gray-50 dark:bg-dark-700 rounded-lg p-2.5 border border-gray-100 dark:border-dark-600">
                                💡 Admin account: <strong>admin@eduflow.com</strong> / <strong>Admin@1234</strong>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base justify-center">
                                {loading ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '🔐 Sign In'}
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                Don't have an account?{' '}
                                <button type="button" onClick={() => switchMode('register')} className="text-primary-600 font-semibold hover:underline">Register here</button>
                            </p>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="input" />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
                            </div>
                            <div>
                                <label className="label">Password <span className="text-gray-400 font-normal">(min 6 chars)</span></label>
                                <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input" />
                            </div>
                            <div>
                                <label className="label">Confirm Password</label>
                                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={`input ${confirm && confirm !== password ? 'border-red-400 focus:border-red-400' : ''}`} />
                                {confirm && confirm !== password && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
                            </div>
                            <button type="submit" disabled={loading || (confirm && confirm !== password)} className="btn-primary w-full py-3 text-base justify-center disabled:opacity-60">
                                {loading ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '✨ Create Account'}
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                Already have an account?{' '}
                                <button type="button" onClick={() => switchMode('login')} className="text-primary-600 font-semibold hover:underline">Sign in</button>
                            </p>
                        </form>
                    )}

                    {/* Quick Demo */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
                            <span className="text-xs text-gray-400 font-medium">Quick Demo</span>
                            <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {DEMOS.map(r => (
                                <button key={r.key} onClick={() => handleDemo(r.key)}
                                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-dark-600 hover:border-primary-300 transition-all group">
                                    <span className="text-lg">{r.icon}</span>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">{r.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">No account needed — instant access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
