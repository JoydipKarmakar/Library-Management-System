export default function Topbar() {
  return (
    <header className="topbar">
      <div className="search-bar autocomplete-container">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search..." />
      </div>
    </header>
  );
}