export default function Dashboard() {
  return (
    <div className="view-section">
      <h1 className="page-title">Librarian Dashboard Overview</h1>
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-info"><h3>TOTAL BOOKS</h3><p className="metric-value">12,450</p></div>
          <div className="metric-icon blue"><i className="fa-solid fa-book"></i></div>
        </div>
        <div className="card metric-card">
          <div className="metric-info"><h3>ACTIVE MEMBERS</h3><p className="metric-value">3,210</p></div>
          <div className="metric-icon green"><i className="fa-solid fa-users"></i></div>
        </div>
        <div className="card metric-card">
          <div className="metric-info"><h3>ACTIVE LOANS</h3><p className="metric-value">845</p></div>
          <div className="metric-icon orange"><i className="fa-solid fa-rotate"></i></div>
        </div>
        <div className="card metric-card overdue-card">
          <div className="metric-info"><h3 className="red-text">OVERDUE BOOKS</h3><p className="metric-value red-text">42</p></div>
          <div className="metric-icon red"><i className="fa-solid fa-triangle-exclamation"></i></div>
        </div>
      </div>
      <div className="card table-card">
        <h2>Recent Transactions</h2>
        <table className="transaction-table">
          <thead><tr><th>Trans. ID</th><th>Book Title</th><th>Member Name</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>#1024</td><td>Modern Compiler Implementation in C</td><td>Emily Chen</td><td>2026-09-14</td><td><span className="status issued">Issued</span></td></tr>
            <tr><td>#1022</td><td>Designing Data-Intensive Applications</td><td>Jane Smith</td><td>2026-09-01</td><td><span className="status overdue">Overdue</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}