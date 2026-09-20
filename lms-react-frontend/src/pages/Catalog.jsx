import { useState, useEffect } from 'react';

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', genre: '', copies: 1 });

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      setBooks(await response.json());
    } catch (error) { console.error("Database connection failed", error); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewBook({ title: '', author: '', isbn: '', genre: '', copies: 1 });
        fetchBooks();
      } else { alert("Failed to add book."); }
    } catch (error) { alert("Ensure Flask server is running."); }
  };

  return (
    <div className="view-section">
      <div className="page-header">
        <h1 className="page-title">Book Catalog</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><i className="fa-solid fa-plus"></i> Add New Book</button>
      </div>

      <div className="card table-card">
        <table className="transaction-table catalog-table">
          <thead><tr><th>Book Details</th><th>ISBN</th><th>Genre</th><th>Copies (Avail/Total)</th></tr></thead>
          <tbody>
            {books.map(book => (
              <tr key={book.isbn}>
                <td><div className="book-info"><strong>{book.title}</strong><span className="author-name">{book.author}</span></div></td>
                <td>{book.isbn}</td><td>{book.genre}</td>
                <td><span className="status issued">{book.available} / {book.total}</span></td>
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
              <button className="action-btn" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form className="action-form" onSubmit={handleAddBook}>
              <div className="form-group"><label>Title</label><input type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required /></div>
              <div className="form-group"><label>Author</label><input type="text" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required /></div>
              <div className="form-group"><label>ISBN</label><input type="text" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} required /></div>
              <div className="form-group"><label>Genre</label><input type="text" value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} required /></div>
              <div className="form-group"><label>Total Copies</label><input type="number" min="1" value={newBook.copies} onChange={e => setNewBook({...newBook, copies: e.target.value})} required /></div>
              <button type="submit" className="btn btn-primary full-width">Save Book</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}