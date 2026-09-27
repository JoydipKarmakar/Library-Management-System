import React, { useState, useEffect } from 'react';

export default function Circulation() {
  const [memberQuery, setMemberQuery] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState([]);
  
  const [issuedBooks, setIssuedBooks] = useState([]);

  // Fetch Member Suggestions
  useEffect(() => {
    if (memberQuery.length < 1) { 
      setMemberSuggestions([]); 
      // Clear selected member if they erase the input
      if (!selectedMember || selectedMember.id !== memberQuery) {
        setSelectedMember(null);
        setIssuedBooks([]);
      }
      return; 
    }
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMemberSuggestions(data.filter(m => m.id.toLowerCase().includes(memberQuery.toLowerCase()) || m.name.toLowerCase().includes(memberQuery.toLowerCase())));
      } catch (err) {}
    };
    fetchMembers();
  }, [memberQuery]);

  // Fetch Book Suggestions
  useEffect(() => {
    if (bookQuery.length < 1) { setBookSuggestions([]); return; }
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBookSuggestions(data.filter(b => b.isbn.toLowerCase().includes(bookQuery.toLowerCase()) || b.title.toLowerCase().includes(bookQuery.toLowerCase())));
      } catch (err) {}
    };
    fetchBooks();
  }, [bookQuery]);

  // Fetch Issued Books when a member is selected
  const fetchIssuedBooks = async (memberId) => {
    try {
      const response = await fetch(`/api/issued-books?member_id=${memberId}`);
      if (response.ok) {
        const data = await response.json();
        setIssuedBooks(data);
      } else {
         setIssuedBooks([]);
      }
    } catch (err) {
      console.error("Error fetching issued books");
    }
  };

  // Lock in the member selection
  const handleMemberSelect = (member) => {
    setMemberQuery(member.id);
    setSelectedMember(member);
    setMemberSuggestions([]);
    fetchIssuedBooks(member.id);
  };

  const handleCheckout = async () => {
    if (!selectedMember || !bookQuery) {
      alert("Please select a member and a book.");
      return;
    }
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: selectedMember.id, isbn: bookQuery })
      });
      if (response.ok) {
        alert("Checkout Successful!");
        setBookQuery(''); // Clear book input
        fetchIssuedBooks(selectedMember.id); // Refresh their active loans list
      } else { 
        const err = await response.json();
        alert(`Checkout Failed: ${err.error || 'Unknown error'}`); 
      }
    } catch (error) { alert("API connection error."); }
  };

  const handleCheckIn = async (isbn) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: selectedMember.id, isbn: isbn })
      });
      if (response.ok) {
        alert("Book Returned Successfully!");
        fetchIssuedBooks(selectedMember.id); // Refresh their active loans list
      } else {
        alert("Return Failed.");
      }
    } catch (error) {
      alert("API connection error.");
    }
  };

  return (
    <div className="view-section">
      <div className="page-header"><h1 className="page-title">Circulation Desk</h1></div>
      
      <div className="circulation-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* --- ISSUE BOOK SECTION --- */}
        <div className="card form-card">
          <h2><i className="fa-solid fa-arrow-right-from-bracket blue"></i> Issue Book</h2>
          
          <div className="form-group autocomplete-container">
            <label>Member ID</label>
            <input 
              type="text" 
              value={memberQuery} 
              onChange={e => {setMemberQuery(e.target.value); setSelectedMember(null); setIssuedBooks([]);}} 
              placeholder="e.g. 101" 
            />
            {memberSuggestions.length > 0 && (
              <ul className="autocomplete-list active">
                {memberSuggestions.map(m => (
                  <li key={m.id} onClick={() => handleMemberSelect(m)}>
                    <i className="fa-solid fa-user"></i> {m.id} - {m.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group autocomplete-container">
            <label>Book ISBN or Title</label>
            <input type="text" value={bookQuery} onChange={e => setBookQuery(e.target.value)} placeholder="e.g. 978-0135957059" />
            {bookSuggestions.length > 0 && (
              <ul className="autocomplete-list active">
                {bookSuggestions.map(b => (
                  <li key={b.isbn} onClick={() => { setBookQuery(b.isbn); setBookSuggestions([]); }}>
                    <i className="fa-solid fa-book"></i> {b.isbn} - {b.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={handleCheckout} className="btn btn-primary full-width" disabled={!selectedMember || !bookQuery}>
            Process Checkout
          </button>
        </div>

        {/* --- RETURN BOOK SECTION --- */}
        <div className="card form-card">
          <h2><i className="fa-solid fa-arrow-right-to-bracket green"></i> Active Loans (Check-in)</h2>
          
          {!selectedMember ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
              Search and select a Member ID on the left to view their checked-out books.
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>
                Loans for <strong>{selectedMember.name}</strong>
              </h3>
              
              {issuedBooks.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {issuedBooks.map((book, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{book.title}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>ISBN: {book.isbn}</div>
                      </div>
                      <button 
                        onClick={() => handleCheckIn(book.isbn)}
                        style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Return
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', backgroundColor: '#F9FAFB', borderRadius: '4px' }}>
                  No books currently issued to this member.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}