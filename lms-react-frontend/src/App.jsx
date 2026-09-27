import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Members from './pages/Members';
import Circulation from './pages/Circulation';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - No Sidebar or Topbar */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Wraps your exact existing layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={
            <div className="dashboard-container">
              <Sidebar />
              <main className="main-content">
                <Topbar />
                <div className="content-wrapper">
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/circulation" element={<Circulation />} />
                    
                    {/* Role-Specific Dashboards */}
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                  </Routes>
                </div>
              </main>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}