import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fa-solid fa-book"></i>
        <h2>LMS Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/"><i className="fa-solid fa-house"></i> Dashboard</NavLink></li>
          <li><NavLink to="/catalog"><i className="fa-solid fa-book-open"></i> Catalog</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}