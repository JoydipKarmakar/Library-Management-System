import { useState, useEffect } from 'react';

export default function Circulation() {
  const [memberQuery, setMemberQuery] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState([]);

  // Fetch Member Suggestions
  useEffect(() => {
    if (memberQuery.length < 1) { setMemberSuggestions([]); return; }
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/members');
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
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        setBookSuggestions(data.filter(b => b.isbn.toLowerCase().includes(bookQuery.toLowerCase()) || b.title.toLowerCase().includes(bookQuery.toLowerCase())));
      } catch (err) {}
    };
    fetchBooks();
  }, [bookQuery]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberQuery, isbn: bookQuery })
      });
      if (response.ok) {
        alert("Checkout Successful!");
        setMemberQuery('');
        setBookQuery('');
      } else { alert("Checkout Failed."); }
    } catch (error) { alert("API connection error."); }
  };

  return (
    <div className="view-section">
      <div className="page-header"><h1 className="page-title">Circulation Desk</h1></div>
      <div className="circulation-grid">
        <div className="card form-card">
          <h2><i className="fa-solid fa-arrow-right-from-bracket blue"></i> Issue Book</h2>
          
          <div className="form-group autocomplete-container">
            <label>Member ID</label>
            <input type="text" value={memberQuery} onChange={e => setMemberQuery(e.target.value)} placeholder="e.g. M-2041" />
            {memberSuggestions.length > 0 && (
              <ul className="autocomplete-list active">
                {memberSuggestions.map(m => (
                  <li key={m.id} onClick={() => { setMemberQuery(m.id); setMemberSuggestions([]); }}>
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

          <button onClick={handleCheckout} className="btn btn-primary full-width">Process Checkout</button>
        </div>
      </div>
    </div>
  );
}
