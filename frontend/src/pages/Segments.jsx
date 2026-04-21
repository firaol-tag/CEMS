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

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const res = await fetch('/api/segments', { headers: getAuthHeaders() });
    const data = await res.json();
    setSegments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({ name: '', filter_json: {} });
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
          <textarea
            placeholder="Filter JSON (e.g., {location: 'Addis Ababa'})"
            value={JSON.stringify(formData.filter_json)}
            onChange={(e) => {
              try {
                setFormData({ ...formData, filter_json: JSON.parse(e.target.value) });
              } catch {}
            }}
          />
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
