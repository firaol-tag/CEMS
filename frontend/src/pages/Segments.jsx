import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Segments() {
  const { getAuthHeaders } = useAuth();
  const [segments, setSegments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    filter_json: {},
  });
  const [filterFields, setFilterFields] = useState({
    location: '',
    gender: '',
    customer_type: '',
    last_purchase_days: '',
  });

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const res = await fetch('/api/segments', { headers: getAuthHeaders() });
    const data = await res.json();
    setSegments(data);
  };

  const updateFilterJson = () => {
    const filter = {};
    if (filterFields.location) filter.location = filterFields.location;
    if (filterFields.gender) filter.gender = filterFields.gender;
    if (filterFields.customer_type) filter.customer_type = filterFields.customer_type;
    if (filterFields.last_purchase_days) filter.last_purchase_days = parseInt(filterFields.last_purchase_days);
    setFormData({ ...formData, filter_json: filter });
  };

  useEffect(() => {
    updateFilterJson();
  }, [filterFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({ name: '', filter_json: {} });
      setFilterFields({ location: '', gender: '', customer_type: '', last_purchase_days: '' });
      setShowForm(false);
      fetchSegments();
    }
  };

  return (
    <div>
      <h2>Segments</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create Segment'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Segment Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
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
          <p>Filter JSON: {JSON.stringify(formData.filter_json)}</p>
          <button type="submit">Create Segment</button>
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Filter</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.id}>
              <td>{segment.name}</td>
              <td>{JSON.stringify(segment.filter_json)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Segments;
