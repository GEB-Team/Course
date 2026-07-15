import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminDocumentsPage from './pages/AdminDocumentsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminLogsPage from './pages/AdminLogsPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import TrainingPage from './pages/TrainingPage';
import CertificationPage from './pages/CertificationPage';
import PaymentPage from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/employee/register" element={<EmployeeRegistrationPage />} />
          
          {/* Employee Portal Routes */}
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/register" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <CoursesPage initialTab={0} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/learning" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <CoursesPage initialTab={1} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/progress" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <CoursesPage initialTab={2} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/training" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <TrainingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certification" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <CertificationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <RecommendationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <SupportPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Portal Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/documents" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDocumentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCoursesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLogsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
