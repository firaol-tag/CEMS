function Campaigns() {
  const sample = [
    { id: 1, title: 'Holiday Launch', type: 'email', status: 'scheduled', target: 'All customers' },
    { id: 2, title: 'Addis Promo', type: 'sms', status: 'draft', target: 'Location: Addis Ababa' },
  ];

  return (
    <div>
      <div className="card">
        <h3>Campaigns</h3>
        <p>Use the campaign builder to target customers via email, SMS, or both.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Type</th>
              <th>Status</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.title}</td>
                <td>{campaign.type}</td>
                <td>{campaign.status}</td>
                <td>{campaign.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Campaigns;
