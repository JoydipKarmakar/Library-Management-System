import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();
  // Read the role from storage, default to admin if not found
  const role = localStorage.getItem('userRole') || 'admin';
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '15px 30px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {displayRole.charAt(0)}
          </div>
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '15px' }}>{displayRole}</span>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}>
          Logout
        </button>
      </div>
    </header>
  );
}