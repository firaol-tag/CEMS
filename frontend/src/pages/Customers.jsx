function Customers() {
  const sample = [
    { id: 1, name: 'Eleni A.', email: 'eleni@example.com', location: 'Addis Ababa', last_purchase: '2026-04-10' },
    { id: 2, name: 'Michael K.', email: 'michael@example.com', location: 'Bahir Dar', last_purchase: '2026-03-12' },
  ];

  return (
    <div>
      <div className="card">
        <h3>Customers</h3>
        <p>Manage the customer directory and segment buyers for campaigns.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Last Purchase</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.location}</td>
                <td>{customer.last_purchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
