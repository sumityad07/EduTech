import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-dark-900 p-8">
                <div className="card max-w-md text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
                    <p className="text-sm text-gray-500 mb-4">{this.state.error?.message}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
                </div>
            </div>
        );
        return this.props.children;
    }
}
