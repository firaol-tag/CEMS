function Segments() {
  const sample = [
    { id: 1, name: 'Recent Buyers', rules: 'Last purchase in 30 days' },
    { id: 2, name: 'Addis Ababa', rules: 'Location = Addis Ababa' },
  ];

  return (
    <div>
      <div className="card">
        <h3>Customer Segments</h3>
        <p>Save filtered groups for targeted campaigns and promotions.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Filter</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(segment => (
              <tr key={segment.id}>
                <td>{segment.name}</td>
                <td>{segment.rules}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Segments;
