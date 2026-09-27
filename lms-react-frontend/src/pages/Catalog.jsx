import { useState, useEffect } from 'react';

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', genre: '', totalCopies: 1 });
  
  // Read role to determine if we should show the Add Book button
  const role = localStorage.getItem('userRole') || 'student';

  const fetchBooks = async () => {
    try {
      // Use relative path for Nginx
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) { 
      console.error("Database connection failed", error); 
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      // Use relative path for Nginx
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBook,
          availableCopies: newBook.totalCopies // When adding a new book, available = total
        })
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setNewBook({ title: '', author: '', isbn: '', genre: '', totalCopies: 1 });
        fetchBooks();
      } else { 
        alert("Failed to add book."); 
      }
    } catch (error) { 
      alert("Ensure backend server is running."); 
    }
  };

  return (
    <div className="view-section">
      <div className="page-header">
        <h1 className="page-title">Book Catalog</h1>
        {/* Only Admins can add new books manually */}
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> Add New Book
          </button>
        )}
      </div>

      <div className="card table-card">
        <table className="transaction-table catalog-table">
          <thead>
            <tr>
              <th>Book Details</th>
              <th>ISBN</th>
              <th>Genre</th>
              <th>Copies (Avail/Total)</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id || book.isbn}>
                <td>
                  <div className="book-info">
                    <strong>{book.title}</strong>
                    <span className="author-name">{book.author}</span>
                  </div>
                </td>
                <td>{book.isbn}</td>
                <td>{book.genre}</td>
                <td>
                  <span className="status issued">
                    {/* Maps to the exact variable names sent by Flask */}
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form className="action-form" onSubmit={handleAddBook}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input type="text" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input type="text" value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Total Copies</label>
                <input type="number" min="1" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} required />
              </div>
              <button type="submit" className="btn btn-primary full-width">Save Book</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}