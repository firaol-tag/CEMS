import { useAuth } from '../context/AuthContext';

function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <h1>Customer Engagement</h1>
        <p>Send targeted campaigns, monitor engagement, and build segments.</p>
      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Topbar;
