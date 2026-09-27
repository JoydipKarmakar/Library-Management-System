import React from 'react';

export default function FacultyDashboard() {
  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0' }}>Faculty Portal</h1>
          <p style={{ color: '#6B7280', margin: 0 }}>Manage your research materials and course reservations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ backgroundColor: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Request Material
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3 style={{ color: '#6B7280', fontSize: '14px', marginTop: 0 }}>Extended Checkouts</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '10px 0' }}>4</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#6B7280', fontSize: '14px', marginTop: 0 }}>Active Course Reserves</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', margin: '10px 0' }}>1</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '15px', marginTop: 0 }}>Research & Borrowing History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px' }}>
              <th style={{ paddingBottom: '10px' }}>Material Title</th>
              <th style={{ paddingBottom: '10px' }}>Type</th>
              <th style={{ paddingBottom: '10px' }}>Extended Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '15px 0', fontWeight: '500' }}>Advanced Engineering Mathematics</td>
              <td style={{ color: '#4B5563' }}>Textbook</td>
              <td style={{ color: '#10B981', fontWeight: '500' }}>Nov 15, 2026</td>
            </tr>
            <tr>
              <td style={{ padding: '15px 0', fontWeight: '500' }}>Quantum Computing Principles</td>
              <td style={{ color: '#4B5563' }}>Journal Archive</td>
              <td style={{ color: '#10B981', fontWeight: '500' }}>Dec 01, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' };