import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState({ customers: 0, campaigns: 0, segments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, campaignsRes, segmentsRes] = await Promise.all([
          fetch('/api/customers', { headers: getAuthHeaders() }),
          fetch('/api/campaigns', { headers: getAuthHeaders() }),
          fetch('/api/segments', { headers: getAuthHeaders() }),
        ]);
        const customers = await customersRes.json();
        const campaigns = await campaignsRes.json();
        const segments = await segmentsRes.json();
        setStats({
          customers: customers.length,
          campaigns: campaigns.length,
          segments: segments.length,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, [getAuthHeaders]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Customers</h3>
          <p>Total: {stats.customers}</p>
        </div>
        <div className="card">
          <h3>Campaigns</h3>
          <p>Total: {stats.campaigns}</p>
        </div>
        <div className="card">
          <h3>Segments</h3>
          <p>Total: {stats.segments}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
