import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalSearch from './components/common/GlobalSearch';
import ToastManager from './components/common/ToastManager';

// Lazy loaded pages
const Login = lazy(() => import('./pages/auth/Login'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentCourses = lazy(() => import('./pages/student/MyCourses'));
const Explore = lazy(() => import('./pages/student/Explore'));
const CareerTools = lazy(() => import('./pages/student/CareerTools'));
const Analytics = lazy(() => import('./pages/student/Analytics'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
const QuizAttemptPage = lazy(() => import('./pages/student/QuizAttemptPage'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));
const AdminTests = lazy(() => import('./pages/admin/Tests'));
const AdminQuizzes = lazy(() => import('./pages/admin/Quizzes'));

const SponsorDashboard = lazy(() => import('./pages/sponsor/Dashboard'));
const SponsorStudents = lazy(() => import('./pages/sponsor/Students'));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-dark-900">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading EduFlow...</p>
        </div>
    </div>
);

export default function App() {
    const { isAuthenticated, user } = useAuthStore();

    const getDefaultRoute = () => {
        if (!isAuthenticated) return '/login';
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'sponsor') return '/sponsor/dashboard';
        return '/student/dashboard';
    };

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <ToastManager />
                <GlobalSearch />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />

                        {/* Student Routes */}
                        <Route path="/student" element={<ProtectedRoute role="student" />}>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="courses" element={<StudentCourses />} />
                            <Route path="explore" element={<Explore />} />
                            <Route path="career" element={<CareerTools />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="profile" element={<StudentProfile />} />
                            <Route path="quiz/:quizId" element={<QuizAttemptPage />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="courses" element={<AdminCourses />} />
                            <Route path="quizzes" element={<AdminQuizzes />} />
                            <Route path="students" element={<AdminStudents />} />
                            <Route path="tests" element={<AdminTests />} />
                        </Route>

                        {/* Sponsor Routes */}
                        <Route path="/sponsor" element={<ProtectedRoute role="sponsor" />}>
                            <Route path="dashboard" element={<SponsorDashboard />} />
                            <Route path="students" element={<SponsorStudents />} />
                        </Route>

                        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
                        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </BrowserRouter>
    );
}
