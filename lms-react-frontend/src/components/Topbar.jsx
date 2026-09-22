import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="search-bar autocomplete-container">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search for books, ISBN, or members..." />
      </div>
      <div className="user-profile">
        <span className="user-name">Admin</span>
        {/* Added logout button */}
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          Logout
        </button>
      </div>
    </header>
  );
}