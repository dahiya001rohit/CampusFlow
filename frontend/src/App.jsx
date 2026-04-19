import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import MyBookings from './pages/MyBookings';
import MyComplaints from './pages/MyComplaints';
import AdminResources from './pages/AdminResources';
import AdminBookings from './pages/AdminBookings';
import AdminComplaints from './pages/AdminComplaints';

function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/dashboard" element={
        <PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>
      } />
      <Route path="/resources" element={
        <PrivateRoute><AppLayout><Resources /></AppLayout></PrivateRoute>
      } />
      <Route path="/my-bookings" element={
        <PrivateRoute><AppLayout><MyBookings /></AppLayout></PrivateRoute>
      } />
      <Route path="/my-complaints" element={
        <PrivateRoute><AppLayout><MyComplaints /></AppLayout></PrivateRoute>
      } />
      <Route path="/admin/resources" element={
        <PrivateRoute adminOnly><AppLayout><AdminResources /></AppLayout></PrivateRoute>
      } />
      <Route path="/admin/bookings" element={
        <PrivateRoute adminOnly><AppLayout><AdminBookings /></AppLayout></PrivateRoute>
      } />
      <Route path="/admin/complaints" element={
        <PrivateRoute adminOnly><AppLayout><AdminComplaints /></AppLayout></PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
