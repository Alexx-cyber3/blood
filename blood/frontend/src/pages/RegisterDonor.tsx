import React, { useState } from 'react';
import axios from 'axios';

const RegisterDonor = () => {
  const [formData, setFormData] = useState({
    name: '',
    blood_group: 'A+',
    location: '',
    contact: '',
    age: '',
    last_donation: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/donors', formData);
      setMessage('Registration Successful!');
      setFormData({
        name: '',
        blood_group: 'A+',
        location: '',
        contact: '',
        age: '',
        last_donation: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('Error registering donor.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Register as a Donor</h2>
              {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={formData.blood_group} onChange={(e) => setFormData({...formData, blood_group: e.target.value})}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">City / Location</label>
                  <input type="text" className="form-control" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input type="text" className="form-control" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Last Donation Date (if any)</label>
                  <input type="date" className="form-control" value={formData.last_donation} onChange={(e) => setFormData({...formData, last_donation: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-danger w-100 py-2">Register Now</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDonor;
