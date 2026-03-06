import { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext(null);
let toastFn = null;

export const toast = (message, type = 'info') => { if (toastFn) toastFn(message, type); };

export default function ToastManager() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastFn = (message, type) => {
            const id = Date.now();
            setToasts(t => [...t, { id, message, type }]);
            setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
        };
    }, []);

    const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
    const classes = { success: 'toast-success', error: 'toast-error', info: 'toast-info', warning: 'toast-warning' };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id} className={classes[t.type] || 'toast-info'}>
                    <span>{icons[t.type]}</span>
                    <span>{t.message}</span>
                    <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="ml-2 opacity-70 hover:opacity-100">×</button>
                </div>
            ))}
        </div>
    );
}
