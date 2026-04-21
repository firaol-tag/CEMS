import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Campaigns() {
  const { getAuthHeaders } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email',
    target_type: 'all',
    target_data: {},
    scheduled_at: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns', { headers: getAuthHeaders() });
    const data = await res.json();
    setCampaigns(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({
        title: '',
        message: '',
        type: 'email',
        target_type: 'all',
        target_data: {},
      });
      setShowForm(false);
      fetchCampaigns();
    }
  };

  const sendCampaign = async (id) => {
    await fetch(`/api/campaigns/${id}/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    fetchCampaigns();
  };

  const scheduleCampaign = async (id) => {
    const scheduledAt = prompt('Enter scheduled date and time (YYYY-MM-DDTHH:MM):');
    if (scheduledAt) {
      await fetch(`/api/campaigns/${id}/schedule`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_at: scheduledAt }),
      });
      fetchCampaigns();
    }
  };

  return (
    <div>
      <h2>Campaigns</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create Campaign'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
          </select>
          <select
            value={formData.target_type}
            onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
          >
            <option value="all">All Customers</option>
            <option value="filtered">Filtered</option>
          </select>
          <input
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            placeholder="Schedule At (optional)"
          />
          <button type="submit">Create Campaign</button>
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.title}</td>
              <td>{campaign.type}</td>
              <td>{campaign.status}</td>
              <td>
                {campaign.status === 'draft' && (
                  <>
                    <button onClick={() => sendCampaign(campaign.id)}>Send Now</button>
                    <button onClick={() => scheduleCampaign(campaign.id)}>Schedule</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Campaigns;
