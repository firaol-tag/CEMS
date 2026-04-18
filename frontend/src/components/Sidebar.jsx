import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2>CEMS</h2>
        <p>Customer engagement hub</p>
      </div>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/campaigns">Campaigns</NavLink>
        <NavLink to="/segments">Segments</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
