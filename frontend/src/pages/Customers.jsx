import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Customers() {
  const { getAuthHeaders } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    location: '',
    customer_type: 'regular',
    last_purchase_date: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers', { headers: getAuthHeaders() });
    const data = await res.json();
    setCustomers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        location: '',
        last_purchase_date: '',
      });
      setShowForm(false);
      fetchCustomers();
    }
  };

  return (
    <div>
      <h2>Customers</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Customer'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <select
            value={formData.customer_type}
            onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
          >
            <option value="regular">Regular</option>
            <option value="g-power">G-Power</option>
            <option value="five-star">Five-Star</option>
          </select>
          <input
            type="date"
            value={formData.last_purchase_date}
            onChange={(e) => setFormData({ ...formData, last_purchase_date: e.target.value })}
          />
          <button type="submit">Add Customer</button>
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Last Purchase</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.gender}</td>
              <td>{customer.location}</td>
              <td>{customer.last_purchase_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
