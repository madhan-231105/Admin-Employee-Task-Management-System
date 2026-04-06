import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

/**
 * ProtectedRoute Component
 * Checks localStorage for a valid session and verifies the user's role
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // 1. If not logged in, send to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but wrong role, redirect to their specific dashboard
  if (user.role !== allowedRole) {
    const fallbackPath = user.role === 'admin' ? '/admin' : '/employee';
    return <Navigate to={fallbackPath} replace />;
  }

  // 3. Authorized
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Only Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Employee Only Route */}
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;