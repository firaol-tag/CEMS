import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Campaigns() {
  const { getAuthHeaders } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email',
    target_type: 'all',
    target_data: {},
    scheduled_at: '',
  });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filterFields, setFilterFields] = useState({
    location: '',
    gender: '',
    customer_type: '',
    last_purchase_days: '',
  });

  useEffect(() => {
    fetchCampaigns();
    fetchCustomers();
  }, []);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns', { headers: getAuthHeaders() });
    const data = await res.json();
    setCampaigns(data);
  };

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers', { headers: getAuthHeaders() });
    const data = await res.json();
    setCustomers(data);
  };

  const updateTargetData = () => {
    if (formData.target_type === 'filtered') {
      const filter = {};
      if (filterFields.location) filter.location = filterFields.location;
      if (filterFields.gender) filter.gender = filterFields.gender;
      if (filterFields.customer_type) filter.customer_type = filterFields.customer_type;
      if (filterFields.last_purchase_days) filter.last_purchase_days = parseInt(filterFields.last_purchase_days);
      setFormData({ ...formData, target_data: filter });
    } else if (formData.target_type === 'specific') {
      setFormData({ ...formData, target_data: selectedCustomers });
    } else {
      setFormData({ ...formData, target_data: {} });
    }
  };

  useEffect(() => {
    updateTargetData();
  }, [formData.target_type, filterFields, selectedCustomers]);

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
        scheduled_at: '',
      });
      setSelectedCustomers([]);
      setFilterFields({ location: '', gender: '', customer_type: '', last_purchase_days: '' });
      setShowForm(false);
      fetchCampaigns();
    }
  };

  const sendCampaign = async (id) => {
    await fetch(`/api/campaigns/${id}/send-now`, {
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

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
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
            <option value="filtered">Filtered Customers</option>
            <option value="specific">Specific Customers</option>
          </select>
          {formData.target_type === 'filtered' && (
            <div>
              <h3>Filter Criteria</h3>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  placeholder="e.g., Addis Ababa"
                  value={filterFields.location}
                  onChange={(e) => setFilterFields({ ...filterFields, location: e.target.value })}
                />
              </div>
              <div>
                <label>Gender:</label>
                <select
                  value={filterFields.gender}
                  onChange={(e) => setFilterFields({ ...filterFields, gender: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label>Customer Type:</label>
                <select
                  value={filterFields.customer_type}
                  onChange={(e) => setFilterFields({ ...filterFields, customer_type: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label>Last Purchase (days ago):</label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  value={filterFields.last_purchase_days}
                  onChange={(e) => setFilterFields({ ...filterFields, last_purchase_days: e.target.value })}
                />
              </div>
            </div>
          )}
          {formData.target_type === 'specific' && (
            <div>
              <h3>Select Customers</h3>
              <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {customers.map(customer => (
                  <div key={customer.id}>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                    />
                    {customer.name} ({customer.email})
                  </div>
                ))}
              </div>
            </div>
          )}
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
