import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Members from './pages/Members';
import Circulation from './pages/Circulation';

export default function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/members" element={<Members />} />
              <Route path="/circulation" element={<Circulation />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}