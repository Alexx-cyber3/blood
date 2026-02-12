import React, { useState } from 'react';
import axios from 'axios';

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    blood_group: 'A+',
    location: '',
    contact: '',
    urgency: 'Normal'
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/requests', formData);
      const requestId = res.data.id;
      
      // Auto-fetch matches after request
      const matchRes = await axios.get(`http://localhost:5000/api/match/${requestId}`);
      setMatches(matchRes.data.matches);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error submitting request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="mb-4">Request Blood</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Patient Name</label>
                  <input type="text" className="form-control" required value={formData.patient_name} onChange={(e) => setFormData({...formData, patient_name: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Blood Group Needed</label>
                  <select className="form-select" value={formData.blood_group} onChange={(e) => setFormData({...formData, blood_group: e.target.value})}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location (City)</label>
                  <input type="text" className="form-control" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Person Number</label>
                  <input type="text" className="form-control" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Urgency Level</label>
                  <select className="form-select" value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})}>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical (Immediate)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? 'Searching...' : 'Search for Donors'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7 mt-4 mt-md-0">
          <h3 className="mb-4">Matching Donors</h3>
          {!submitted && <p className="text-muted">Fill the form to see available donors.</p>}
          {submitted && matches.length === 0 && (
            <div className="alert alert-warning">No donors found matching your criteria in this location.</div>
          )}
          {matches.map((donor) => (
            <div key={donor.id} className="card mb-3 border-start border-danger border-4 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{donor.name}</h5>
                  <p className="mb-0 text-muted">📍 {donor.location} | 📱 {donor.contact}</p>
                </div>
                <div className="text-end">
                  <span className="badge bg-danger fs-6">{donor.blood_group}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;
