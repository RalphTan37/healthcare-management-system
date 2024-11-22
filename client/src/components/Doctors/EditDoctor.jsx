import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './Doctors.css';

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await api.getDoctor(id);
        setFormData({
          firstName: data.first_name,
          lastName: data.last_name,
          specialization: data.specialization,
          email: data.email,
          phone: data.phone
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching doctor details');
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateDoctor(id, formData);
      navigate('/doctors');
    } catch (err) {
      setError('Error updating doctor');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="doctor-form-container">
      <h2>Edit Doctor</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">Update Doctor</button>
          <button type="button" className="btn secondary" onClick={() => navigate('/doctors')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;