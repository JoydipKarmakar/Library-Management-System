import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem('userRole') || 'admin';
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <aside className="sidebar" style={{ width: '250px', backgroundColor: '#1F2937', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #374151', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>
          LMS <span style={{ color: '#60A5FA' }}>{displayRole}</span>
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 15px', gap: '10px' }}>
        {/* Admin Navigation */}
        {role === 'admin' && (
          <>
            <Link to="/" className={`sidebar-link ${isActive('/')}`} style={linkStyle(location.pathname === '/')}>Dashboard</Link>
            <Link to="/catalog" className={`sidebar-link ${isActive('/catalog')}`} style={linkStyle(location.pathname === '/catalog')}>Catalog</Link>
            <Link to="/members" className={`sidebar-link ${isActive('/members')}`} style={linkStyle(location.pathname === '/members')}>Members</Link>
            <Link to="/circulation" className={`sidebar-link ${isActive('/circulation')}`} style={linkStyle(location.pathname === '/circulation')}>Circulation</Link>
          </>
        )}

        {/* Student Navigation */}
        {role === 'student' && (
          <>
            <Link to="/student-dashboard" className={`sidebar-link ${isActive('/student-dashboard')}`} style={linkStyle(location.pathname === '/student-dashboard')}>My Dashboard</Link>
            <Link to="/catalog" className={`sidebar-link ${isActive('/catalog')}`} style={linkStyle(location.pathname === '/catalog')}>Browse Catalog</Link>
          </>
        )}

        {/* Faculty Navigation */}
        {role === 'faculty' && (
          <>
            <Link to="/faculty-dashboard" className={`sidebar-link ${isActive('/faculty-dashboard')}`} style={linkStyle(location.pathname === '/faculty-dashboard')}>Faculty Dashboard</Link>
            <Link to="/catalog" className={`sidebar-link ${isActive('/catalog')}`} style={linkStyle(location.pathname === '/catalog')}>Browse Catalog</Link>
          </>
        )}
      </nav>
    </aside>
  );
}

const linkStyle = (active) => ({
  padding: '12px 15px',
  color: active ? '#ffffff' : '#9CA3AF',
  backgroundColor: active ? '#374151' : 'transparent',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: '500',
  display: 'block',
  transition: 'all 0.2s'
});