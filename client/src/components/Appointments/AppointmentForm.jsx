import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Appointments.css';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [doctorsData, patientsData] = await Promise.all([
        api.getDoctors(),
        api.getPatients()
      ]);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setLoading(false);
    } catch (err) {
      setError('Error loading data');
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const slots = await api.getAvailableSlots(doctorId, date);
      setAvailableSlots(slots);
    } catch (err) {
      setError('Error fetching available slots');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'doctorId' || name === 'appointmentDate') {
      fetchAvailableSlots(
        name === 'doctorId' ? value : formData.doctorId,
        name === 'appointmentDate' ? value : formData.appointmentDate
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment(formData);
      navigate('/appointments');
    } catch (err) {
      setError('Error booking appointment. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="appointment-form-container">
      <h2>Book New Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="patientId">Patient</label>
          <select
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {`${patient.first_name} ${patient.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="doctorId">Doctor</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                {`Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">Date</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">Time</label>
          <select
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          >
            <option value="">Select Time</option>
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Visit</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">Book Appointment</button>
          <button 
            type="button" 
            className="btn secondary"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;