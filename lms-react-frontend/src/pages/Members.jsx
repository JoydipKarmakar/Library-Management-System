import { useState, useEffect } from 'react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ id: '', name: '', email: '' });

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/members');
      setMembers(await response.json());
    } catch (error) { console.error("Database connection failed", error); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewMember({ id: '', name: '', email: '' });
        fetchMembers();
      } else { alert("Failed to register member."); }
    } catch (error) { alert("Ensure Flask server is running."); }
  };

  return (
    <div className="view-section">
      <div className="page-header">
        <h1 className="page-title">Member Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><i className="fa-solid fa-user-plus"></i> Register Member</button>
      </div>

      <div className="card table-card">
        <table className="transaction-table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td><td><strong>{member.name}</strong></td><td>{member.email}</td>
                <td><span className={`status ${member.status === 'Active' ? 'issued' : 'overdue'}`}>{member.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <div className="modal-header">
              <h2>Register New Member</h2>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form className="action-form" onSubmit={handleRegister}>
              <div className="form-group"><label>Member ID</label><input type="text" placeholder="e.g. M-2045" value={newMember.id} onChange={e => setNewMember({...newMember, id: e.target.value})} required /></div>
              <div className="form-group"><label>Full Name</label><input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required /></div>
              <button type="submit" className="btn btn-primary full-width">Save Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}