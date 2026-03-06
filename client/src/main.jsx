import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { useAuthStore } from './store/authStore'

// Apply saved theme on load
const { theme } = useAuthStore.getState();
if (theme === 'dark') document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
