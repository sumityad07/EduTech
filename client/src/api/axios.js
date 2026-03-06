import axios from 'axios';

const api = axios.create({
    baseURL: 'https://edutech-2-gcf8.onrender.com/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token from localStorage store
api.interceptors.request.use((config) => {
    try {
        const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
        const token = stored?.state?.token;
        if (token && token !== 'demo-token') {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (_) { }
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            // Don't nuke session in demo mode — let catch blocks fall back to demo data
            try {
                const stored = JSON.parse(localStorage.getItem('visin-auth') || '{}');
                const token = stored?.state?.token;
                if (token !== 'demo-token') {
                    localStorage.removeItem('visin-auth');
                    window.location.href = '/login';
                }
            } catch (_) {
                localStorage.removeItem('visin-auth');
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;
