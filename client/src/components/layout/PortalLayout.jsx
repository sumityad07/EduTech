import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PortalLayout({ role, children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#FAFAFA] dark:bg-dark-900 overflow-hidden">
            {/* Sidebar */}
            <div className={`${collapsed ? 'w-16' : 'w-64'} shrink-0 transition-all duration-300`}>
                <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(o => !o)} />
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar collapsed={collapsed} onToggle={() => setCollapsed(o => !o)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
