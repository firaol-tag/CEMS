import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '../context/AuthContext';

function Customers() {
  const { getAuthHeaders } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
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
    setFormError('');

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
        customer_type: 'regular',
        last_purchase_date: '',
      });
      setShowForm(false);
      fetchCustomers();
    } else {
      const errorData = await res.json();
      setFormError(errorData.message || 'Unable to add customer');
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
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="customer-name">Name</label>
              <input
                id="customer-name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="customer-email">Email</label>
              <input
                id="customer-email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="field-group full-width">
              <label htmlFor="customer-phone">Phone</label>
              <PhoneInput
                containerClass="phone-input-container"
                inputClass="phone-input-field"
                buttonClass="phone-input-button"
                country="et"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                preferredCountries={['et', 'us', 'gb', 'in', 'za', 'gh', 'ng', 'ke', 'tz']}
                enableSearch
                inputProps={{
                  name: 'phone',
                  id: 'customer-phone',
                  required: false,
                }}
              />
              <small>Pick a country code and enter the rest of the number.</small>
            </div>
            <div className="field-group">
              <label htmlFor="customer-gender">Gender</label>
              <select
                id="customer-gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="customer-location">Location</label>
              <input
                id="customer-location"
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label htmlFor="customer-type">Customer Type</label>
              <select
                id="customer-type"
                value={formData.customer_type}
                onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
              >
                <option value="regular">Regular</option>
                <option value="g-power">G-Power</option>
                <option value="five-star">Five-Star</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="customer-last-purchase">Last Purchase Date</label>
              <input
                id="customer-last-purchase"
                type="date"
                value={formData.last_purchase_date}
                onChange={(e) => setFormData({ ...formData, last_purchase_date: e.target.value })}
              />
            </div>
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <button type="submit">Add Customer</button>
        </form>
      )}
      <div className="table-container">
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
    </div>
  );
}

export default Customers;
