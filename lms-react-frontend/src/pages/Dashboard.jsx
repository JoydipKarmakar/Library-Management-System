import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('book');
  const [status, setStatus] = useState('');
  
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    activeLoans: 0,
    overdueBooks: 0,
    recentTransactions: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    setStatus('Uploading...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ ${data.message}`);
        setFile(null); 
        
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          setStats(await statsResponse.json());
        }
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Network error. Ensure backend is running.');
    }
  };

  return (
    <div className="view-section">
      <h1 className="page-title">Librarian Dashboard Overview</h1>
      
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-info"><h3>TOTAL BOOKS</h3><p className="metric-value">{stats.totalBooks}</p></div>
          <div className="metric-icon blue"><i className="fa-solid fa-book"></i></div>
        </div>
        <div className="card metric-card">
          <div className="metric-info"><h3>ACTIVE MEMBERS</h3><p className="metric-value">{stats.activeMembers}</p></div>
          <div className="metric-icon green"><i className="fa-solid fa-users"></i></div>
        </div>
        <div className="card metric-card">
          <div className="metric-info"><h3>ACTIVE LOANS</h3><p className="metric-value">{stats.activeLoans}</p></div>
          <div className="metric-icon orange"><i className="fa-solid fa-rotate"></i></div>
        </div>
        <div className="card metric-card overdue-card">
          <div className="metric-info"><h3 className="red-text">OVERDUE BOOKS</h3><p className="metric-value red-text">{stats.overdueBooks}</p></div>
          <div className="metric-icon red"><i className="fa-solid fa-triangle-exclamation"></i></div>
        </div>
      </div>

      <div className="card table-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Bulk Data Importer (CSV / Excel)</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>1. Select Data Type:</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" value="book" checked={uploadType === 'book'} onChange={(e) => setUploadType(e.target.value)} />
                Books Catalog
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" value="student" checked={uploadType === 'student'} onChange={(e) => setUploadType(e.target.value)} />
                Student Records
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" value="faculty" checked={uploadType === 'faculty'} onChange={(e) => setUploadType(e.target.value)} />
                Faculty Records
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>2. Upload File:</label>
            <input 
              type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <button type="submit" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}>
            Import to Database
          </button>
        </form>

        {status && (
          <div style={{ marginTop: '15px', padding: '12px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', backgroundColor: status.startsWith('✅') ? '#D1FAE5' : '#FEE2E2', color: status.startsWith('✅') ? '#065F46' : '#991B1B' }}>
            {status}
          </div>
        )}
      </div>

      <div className="card table-card">
        <h2>Recent Transactions</h2>
        <table className="transaction-table">
          <thead>
            <tr><th>Trans. ID</th><th>Book Title</th><th>Member Name</th><th>Due Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.id}</td>
                  <td>{tx.title}</td>
                  <td>{tx.memberName}</td>
                  <td>{tx.dueDate}</td>
                  <td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}