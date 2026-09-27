import React, { useState, useEffect } from 'react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ id: '', name: '', email: '', role: 'student' });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        setMembers(await response.json());
      }
    } catch (error) { 
      console.error("Database connection failed", error); 
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewMember({ id: '', name: '', email: '', role: 'student' });
        fetchMembers();
      } else { 
        alert("Failed to register member."); 
      }
    } catch (error) { 
      alert("Ensure backend server is running."); 
    }
  };

  // UI-level Deactivate Toggle (Updates the frontend state)
  const handleToggleStatus = (id) => {
    if(!window.confirm('Are you sure you want to change this member\'s status?')) return;
    
    setMembers(members.map(member => {
      if (member.id === id) {
        return { ...member, status: member.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return member;
    }));
  };

  // Filter logic for the search bar
  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      String(member.id).toLowerCase().includes(query) ||
      String(member.name).toLowerCase().includes(query) ||
      String(member.email).toLowerCase().includes(query) ||
      String(member.role).toLowerCase().includes(query) ||
      String(member.status).toLowerCase().includes(query)
    );
  });

  return (
    <div className="view-section">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Member Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-user-plus"></i> Register Member
        </button>
      </div>

      <div className="card table-card">
        
        {/* Search Bar */}
        <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
          <input 
            type="text" 
            placeholder="🔍 Search by ID, Name, Email, Role, or Status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
          />
        </div>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.id}</td>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{member.role}</td>
                  <td>
                    <span className={`status ${member.status === 'Active' ? 'issued' : 'overdue'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleStatus(member.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: member.status === 'Active' ? '#FEE2E2' : '#D1FAE5',
                        color: member.status === 'Active' ? '#991B1B' : '#065F46',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <div className="modal-header">
              <h2>Register New Member</h2>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form className="action-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>Member ID / Roll Number</label>
                <input type="text" placeholder="e.g. 101" value={newMember.id} onChange={e => setNewMember({...newMember, id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="text" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '10px' }}>
                Save Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}