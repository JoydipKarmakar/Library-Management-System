import React from 'react';

export default function StudentDashboard() {
  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0' }}>Student Portal</h1>
          <p style={{ color: '#6B7280', margin: 0 }}>Manage your academic reading materials and account status.</p>
        </div>
        <button style={{ backgroundColor: '#3B82F6', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Browse Catalog
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3 style={{ color: '#6B7280', fontSize: '14px', marginTop: 0 }}>Active Borrows</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '10px 0' }}>2</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#6B7280', fontSize: '14px', marginTop: 0 }}>Items Overdue</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444', margin: '10px 0' }}>0</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#6B7280', fontSize: '14px', marginTop: 0 }}>Outstanding Fines</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', margin: '10px 0' }}>$0.00</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '15px', marginTop: 0 }}>Current Checkouts</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px' }}>
                <th style={{ paddingBottom: '10px' }}>Book Title</th>
                <th style={{ paddingBottom: '10px' }}>Checkout Date</th>
                <th style={{ paddingBottom: '10px' }}>Due Date</th>
                <th style={{ paddingBottom: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '15px 0', fontWeight: '500' }}>Introduction to Algorithms</td>
                <td style={{ color: '#4B5563' }}>Sep 15, 2026</td>
                <td style={{ color: '#D97706', fontWeight: '500' }}>Oct 02, 2026</td>
                <td><span style={badgeStyle('#FEF3C7', '#D97706')}>Due Soon</span></td>
              </tr>
              <tr>
                <td style={{ padding: '15px 0', fontWeight: '500' }}>Clean Code</td>
                <td style={{ color: '#4B5563' }}>Sep 20, 2026</td>
                <td style={{ color: '#10B981', fontWeight: '500' }}>Oct 10, 2026</td>
                <td><span style={badgeStyle('#D1FAE5', '#059669')}>Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '15px', marginTop: 0 }}>Recent Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', marginTop: '6px' }}></div>
              <div>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>Account registered successfully</p>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Sep 25, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' };
const badgeStyle = (bg, text) => ({ backgroundColor: bg, color: text, padding: '4px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' });