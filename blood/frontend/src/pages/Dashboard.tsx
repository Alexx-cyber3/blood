import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const donorRes = await axios.get('http://localhost:5000/api/donors');
      const reqRes = await axios.get('http://localhost:5000/api/requests');
      setDonors(donorRes.data);
      setRequests(reqRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        setRequests(requests.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Failed to delete request.');
      }
    }
  };

  const handleDeleteDonor = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await axios.delete(`http://localhost:5000/api/donors/${id}`);
        setDonors(donors.filter(d => d.id !== id));
      } catch (error) {
        console.error('Error deleting donor:', error);
        alert('Failed to delete donor.');
      }
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">Registered Donors</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood Group</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Age</th>
                    <th>Last Donation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td><span className="badge bg-danger">{d.blood_group}</span></td>
                      <td>{d.location}</td>
                      <td>{d.contact}</td>
                      <td>{d.age}</td>
                      <td>{d.last_donation || 'N/A'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteDonor(d.id)}
                          title="Delete Donor"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {donors.length === 0 && <tr><td colSpan={7} className="text-center">No donors registered yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">Blood Requests</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Location</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td>{r.patient_name}</td>
                      <td><span className="badge bg-danger">{r.blood_group}</span></td>
                      <td>{r.location}</td>
                      <td>
                        <span className={`badge ${r.urgency === 'Critical' ? 'bg-danger' : r.urgency === 'Urgent' ? 'bg-warning' : 'bg-info'}`}>
                          {r.urgency}
                        </span>
                      </td>
                      <td>{r.status}</td>
                      <td>{r.created_at}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteRequest(r.id)}
                          title="Delete Request"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan={7} className="text-center">No requests submitted yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
