import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './Appointments.css';

const EditAppointment = () => {
  const { id } = useParams();
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
    const fetchData = async () => {
      try {
        const [appointmentData, doctorsData, patientsData] = await Promise.all([
          api.getAppointment(id),
          api.getDoctors(),
          api.getPatients()
        ]);

        setDoctors(doctorsData);
        setPatients(patientsData);

        const formattedDate = new Date(appointmentData.appointment_date)
          .toISOString().split('T')[0];

        setFormData({
          patientId: appointmentData.patient_id.toString(),
          doctorId: appointmentData.doctor_id.toString(),
          appointmentDate: formattedDate,
          appointmentTime: appointmentData.appointment_time,
          reason: appointmentData.reason
        });

        const slots = await api.getAvailableSlots(
          appointmentData.doctor_id, 
          formattedDate
        );
        setAvailableSlots([...new Set([...slots, appointmentData.appointment_time])]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading appointment data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchAvailableSlots = async () => {
    if (formData.doctorId && formData.appointmentDate) {
      try {
        const slots = await api.getAvailableSlots(
          formData.doctorId, 
          formData.appointmentDate
        );
        setAvailableSlots([...new Set([...slots, formData.appointmentTime])]);
      } catch (err) {
        setError('Error fetching available slots');
      }
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [formData.doctorId, formData.appointmentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.updateAppointment(id, {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason
      });
      navigate('/appointments');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Error updating appointment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="appointment-form-container">
      <h2>Edit Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Patient</label>
          <select
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
          <label>Doctor</label>
          <select
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
          <label>Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <select
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
          <label>Reason for Visit</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">Update Appointment</button>
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

export default EditAppointment;