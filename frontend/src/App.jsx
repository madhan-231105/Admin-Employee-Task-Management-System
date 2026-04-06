import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/employee" element={
          user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;